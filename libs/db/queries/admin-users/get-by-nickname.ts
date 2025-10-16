'use server';
import { pool } from '@/libs/db/db';
import { adminSchema, AdminType } from '@/types/db/tables/admin';

export const getByNickname = async (login: string): Promise<AdminType> => {
  let result;

  const query = `
    SELECT *
    FROM admin
    WHERE login = $1
  `;

  try {
    result = await pool.query(query, [login]);
  } catch (err) {
    console.error(err);
    throw new Error('Ошибка выполнения SQL-запроса');
  }

  try {
    return adminSchema.parse(result.rows[0]);
  } catch (err) {
    console.error(err);
    throw new Error('Ошибка при валидации admin');
  }
};
