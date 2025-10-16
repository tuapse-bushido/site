'use server';
import { pool } from '@/libs/db/db';
import { adminSchema, AdminType } from '@/types/db/tables/admin';

export const getAdminById = async (id: number): Promise<AdminType | null> => {
  const response = await pool.query(
    `SELECT id, login, password_hash, role, is_active, created_at
     FROM admin
     WHERE id = $1`,
    [id],
  );

  if (response.rowCount === 0) return null;

  return adminSchema.parse(response.rows[0]);
};
