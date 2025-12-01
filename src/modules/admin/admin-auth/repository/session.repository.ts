'use server';

import { dbDelete, dbQuery } from '@/src/shared/utils/dbQuery';
import { Session, SessionRow, sessionRowSchema, sessionSchema } from '@/src/modules/admin/admin-auth';
import { ActionResult } from '@/src/shared/types';

export const createRefreshSession = async (adminId: number, expiresAt: Date): Promise<ActionResult<SessionRow>> => {
  const query = `
    INSERT INTO admin_refresh_tokens (admin_id, expires_at)
    VALUES ($1, $2)
    RETURNING id;
  `;
  const params = [adminId, expiresAt];

  return dbQuery(query, params, sessionRowSchema, 'single');
};

export const getRefreshSession = async (refersId: string): Promise<ActionResult<Session>> => {
  const query = `
    SELECT id, admin_id, created_at, expires_at, is_revoked
    from admin_refresh_tokens
    WHERE id = $1;
  `;
  const params = [refersId];

  return dbQuery(query, params, sessionSchema, 'single');
};

export const deleteRefreshSession = async (refreshId: string): Promise<ActionResult<null>> => {
  return dbDelete(
    `
      DELETE
      FROM admin_refresh_tokens
      WHERE id = $1;
    `,
    [refreshId],
  );
};

export const deleteSessionByAdminId = async (adminId: number): Promise<ActionResult<null>> => {
  return dbDelete(
    `
      DELETE
      FROM admin_refresh_tokens
      WHERE admin_id = $1;
    `,
    [adminId],
  );
};
