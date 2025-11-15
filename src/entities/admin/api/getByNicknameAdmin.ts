import { pool } from '@/src/shared/api/db';
import { Admin, adminSchema } from '@/src/entities/admin/model/admin.schema';
import { ActionResult, ErrorCode } from '@/src/shared/types';
import { actionError, actionSuccess } from '@/src/shared/utils';

export const getByNicknameAdmin = async (login: string): Promise<ActionResult<Admin>> => {
  try {
    const { rows, rowCount } = await pool.query(
      `SELECT id, login, password_hash, role, is_active, created_at
       FROM admin
       WHERE login = $1
      `,
      [login],
    );

    if (rowCount === 0) return actionError(ErrorCode.INVALID_CREDENTIALS);

    const result = adminSchema.safeParse(rows[0]);

    if (!result.success) return actionError(ErrorCode.VALIDATION_FAILED);

    return actionSuccess<Admin>(result.data);
  } catch (err) {
    return actionError(ErrorCode.DB_ERROR, { details: err });
  }
};
