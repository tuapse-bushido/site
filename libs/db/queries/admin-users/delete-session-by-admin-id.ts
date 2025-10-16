'use server';
import { pool } from '@/libs/db/db';

export const deleteSessionByAdminId = async (adminId: number): Promise<void> => {
  await pool.query(
    `DELETE
     FROM admin_refresh_tokens
     WHERE admin_id = $1`,
    [adminId],
  );
};
