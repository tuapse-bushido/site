import { dbQuery } from 'shared/utils/db.utils';
import { ActionResult } from 'shared/types/action.types';
import { Admin, adminSchemas as schemas } from 'modules/admin/shared/entities';

export const adminRepo = {
  async getAdminByLogin(login: string): Promise<ActionResult<Admin>> {
    const query = `
    SELECT id, login, password_hash, role, is_active, created_at
    FROM admin
    WHERE login = $1;
  `;
    const params = [login];

    return dbQuery(query, params, schemas.base);
  },

  async getAdminById(id: number): Promise<ActionResult<Admin>> {
    const query = `
    SELECT id, login, password_hash, role, is_active, created_at
    FROM admin
    WHERE id = $1;
  `;
    const params = [id];

    return dbQuery(query, params, schemas.base);
  },
};
