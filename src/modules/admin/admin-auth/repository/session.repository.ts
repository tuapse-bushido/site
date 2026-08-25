import 'server-only';

import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { dbCommand, dbQuery } from 'shared/utils/db.utils';
import { Session, SessionRevokeReason, SessionRow, sessionSchemas as schemas } from 'modules/admin/admin-auth/entities';

export const sessionRepo = {
  async insertSession(
    adminId: number,
    expiresAt: Date,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<SessionRow>> {
    const query = `
    WITH new_session AS (
      SELECT gen_random_uuid() AS id
    )
    INSERT INTO admin_session (id, admin_id, expires_at, refresh_token_hash)
    SELECT id, $1, $2, encode(digest(id::text, 'sha256'), 'hex')
    FROM new_session
    RETURNING id;
  `;
    const params = [adminId, expiresAt];

    return dbQuery(query, params, schemas.session.row, 'single', executor);
  },

  async getSessionByRefreshToken(refreshToken: string): Promise<ActionResult<Session>> {
    const query = `
        SELECT
            id,
            admin_id,
            created_at,
            expires_at,
            refresh_token_hash,
            last_used_at,
            revoked_at,
            revoke_reason,
            ip_address,
            user_agent,
            is_revoked
        FROM admin_session
        WHERE refresh_token_hash =
              encode(digest($1::text, 'sha256'), 'hex');
    `;

    return dbQuery(query, [refreshToken], schemas.session.base, 'single');
  },

  async revokeSession(
    sessionId: string,
    reason: SessionRevokeReason,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<null>> {
    return dbCommand(
      `
          UPDATE admin_session
          SET revoked_at = now(),
              revoke_reason = $2
          WHERE id = $1
            AND revoked_at IS NULL;
      `,
      [sessionId, reason],
      executor,
    );
  },

  async revokeSessionsByAdminId(
    adminId: number,
    reason: SessionRevokeReason,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<null>> {
    return dbCommand(
      `
          UPDATE admin_session
          SET revoked_at = now(),
              revoke_reason = $2
          WHERE admin_id = $1
            AND revoked_at IS NULL;
      `,
      [adminId, reason],
      executor,
    );
  },
};
