'use server';
import { pool } from '@/libs/db/db';
import { QueryResult } from 'pg';
import { refreshTokenRowSchema, RefreshTokenRowType } from '@/types/db/tables/admin-refresh-token';

export const createRefreshSession = async (adminId: number, expiresAt: Date): Promise<string> => {
  const response: QueryResult<RefreshTokenRowType> = await pool.query(
    `INSERT INTO admin_refresh_tokens (admin_id, expires_at)
     VALUES ($1, $2)
     RETURNING id`,
    [adminId, expiresAt],
  );

  const result = refreshTokenRowSchema.parse(response.rows[0]);

  return result.id;
};
