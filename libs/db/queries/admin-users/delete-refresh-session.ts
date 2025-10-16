'use server';
import { pool } from '@/libs/db/db';

export const deleteRefreshSession = async (id: string): Promise<void> => {
  await pool.query(
    `DELETE
     FROM admin_refresh_tokens
     WHERE id = $1`,
    [id],
  );
};
