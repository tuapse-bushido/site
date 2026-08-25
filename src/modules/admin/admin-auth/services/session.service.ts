import { cookies } from 'next/headers';
import { PoolClient } from 'pg';
import { Admin } from 'modules/admin/shared/entities';
import { adminRepo } from 'modules/admin/shared/repository';
import { actionError, actionSuccess } from 'modules/admin/shared/utils/action.utils';
import { ActionResult } from 'shared/types/action.types';
import { pool } from 'shared/configs/db';
import { ErrorCode } from 'shared/types/error-codes.types';
import { logger } from 'shared/utils/logger';
import { sessionRepo } from '../repository';
import { tokenService } from './token.service';
import { Session } from 'modules/admin/admin-auth/entities';

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
};

async function createSessionTokens(
  admin: Admin,
  expiresAt: Date,
  client: PoolClient,
): Promise<ActionResult<SessionTokens>> {
  const sessionResult = await sessionRepo.insertSession(admin.id, expiresAt, client);

  if (!sessionResult.ok) {
    return actionError(sessionResult.code);
  }

  const refreshToken = sessionResult.data.id;
  const accessToken = await tokenService.createAccessToken({
    sub: String(admin.id),
    sid: refreshToken,
    role: admin.role,
  });

  return actionSuccess({
    accessToken,
    refreshToken,
    refreshExpiresAt: expiresAt,
  });
}

async function rotateSession(session: Session, admin: Admin): Promise<ActionResult<SessionTokens>> {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const revokeResult = await sessionRepo.revokeSession(session.id, 'rotated', client);

    if (!revokeResult.ok) {
      await client.query('ROLLBACK');
      return actionError(revokeResult.code);
    }

    const sessionTokensResult = await createSessionTokens(admin, expiresAt, client);

    if (!sessionTokensResult.ok) {
      await client.query('ROLLBACK');
      return actionError(sessionTokensResult.code);
    }

    await client.query('COMMIT');

    return sessionTokensResult;
  } catch (error) {
    await client.query('ROLLBACK');

    logger.error({
      msg: 'ADMIN_SESSION_ROTATION_FAILED',
      sessionId: session.id,
      adminId: admin.id,
      error: error instanceof Error ? error.message : error,
    });

    return actionError(ErrorCode.UNKNOWN);
  } finally {
    client.release();
  }
}

export const sessionService = {
  async refreshSession(refreshToken: string): Promise<ActionResult<SessionTokens>> {
    const sessionResult = await sessionRepo.getSessionByRefreshToken(refreshToken);

    if (!sessionResult.ok) {
      return actionError(sessionResult.code === ErrorCode.NOT_FOUND ? ErrorCode.UNAUTHORIZED : sessionResult.code);
    }

    const session = sessionResult.data;

    if (session.is_revoked) {
      return actionError(ErrorCode.UNAUTHORIZED);
    }

    if (session.expires_at <= new Date()) {
      const revokeResult = await sessionRepo.revokeSession(session.id, 'expired');

      if (!revokeResult.ok && revokeResult.code !== ErrorCode.NOT_FOUND) {
        return actionError(revokeResult.code);
      }

      return actionError(ErrorCode.UNAUTHORIZED);
    }

    const adminResponse = await adminRepo.getAdminById(session.admin_id);

    if (!adminResponse.ok) {
      if (adminResponse.code === ErrorCode.NOT_FOUND) {
        const revokeResult = await sessionRepo.revokeSession(session.id, 'admin_not_found');

        if (!revokeResult.ok && revokeResult.code !== ErrorCode.NOT_FOUND) {
          return actionError(revokeResult.code);
        }

        return actionError(ErrorCode.UNAUTHORIZED);
      }

      return actionError(adminResponse.code);
    }

    const admin = adminResponse.data;

    if (!admin.is_active) {
      const revokeResult = await sessionRepo.revokeSessionsByAdminId(admin.id, 'account_disabled');

      if (!revokeResult.ok && revokeResult.code !== ErrorCode.NOT_FOUND) {
        return actionError(revokeResult.code);
      }

      return actionError(ErrorCode.UNAUTHORIZED);
    }

    return rotateSession(session, admin);
  },

  async startSession(admin: Admin): Promise<ActionResult<null>> {
    if (!admin.is_active) {
      return actionError(ErrorCode.UNAUTHORIZED);
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    let client: PoolClient | undefined;
    let transactionOpen = false;

    try {
      const cookieStore = await cookies();
      client = await pool.connect();
      await client.query('BEGIN');
      transactionOpen = true;

      const sessionTokensResult = await createSessionTokens(admin, expiresAt, client);

      if (!sessionTokensResult.ok) {
        await client.query('ROLLBACK');
        transactionOpen = false;
        return actionError(sessionTokensResult.code);
      }

      await client.query('COMMIT');
      transactionOpen = false;

      const { accessToken, refreshToken, refreshExpiresAt } = sessionTokensResult.data;
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      };

      cookieStore.set('admin_access', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60,
      });

      cookieStore.set('admin_refresh', refreshToken, {
        ...cookieOptions,
        expires: refreshExpiresAt,
      });

      return actionSuccess(null);
    } catch (error) {
      if (client && transactionOpen) {
        await client.query('ROLLBACK');
      }

      logger.error({
        msg: 'ADMIN_SESSION_START_FAILED',
        adminId: admin.id,
        error: error instanceof Error ? error.message : error,
      });

      return actionError(ErrorCode.UNKNOWN);
    } finally {
      client?.release();
    }
  },
};
