'use server';
import { pool } from '@/libs/db/db';
import { QueryResult } from 'pg';
import { adminRefreshTokenSchema, AdminRefreshTokenType } from '@/types/db/tables/admin-refresh-token';

export const getRefreshSession = async (refersId: string): Promise<AdminRefreshTokenType | null> => {
  const response: QueryResult<AdminRefreshTokenType> = await pool.query(
    `SELECT id, admin_id, created_at, expires_at, is_revoked
     from admin_refresh_tokens
     WHERE id = $1`,
    [refersId],
  );

  if (response.rowCount === 0) return null;

  return adminRefreshTokenSchema.parse(response.rows[0]);
};
