'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { ErrorCode, FormState } from '@/src/shared/types';
import { getAdminByLogin } from '@/src/modules/admin/shared/repository/admin.repository';
import { loginFormSchema } from '../model/login-form.schema';
import { formError, parsedFormData } from '@/src/shared/utils/form.utils';
import { startSession } from '@/src/modules/admin/admin-auth/services/auth.service';

export const loginAction = async (_prevState: FormState | null, formData: FormData): Promise<FormState> => {
  const parsed = parsedFormData(formData, loginFormSchema);

  if (!parsed.success) return formError({ ...{ code: ErrorCode.INVALID_INPUT } });

  const { login, password } = parsed.data;

  const response = await getAdminByLogin(login.toString());

  if (!response.ok) return formError({ message: response.message });

  const { data: admin } = response;

  if (!(await bcrypt.compare(password.toString(), admin.password_hash))) {
    return formError({ code: ErrorCode.INVALID_CREDENTIALS });
  }

  await startSession(admin);
  redirect('/admin/dashboard');
};
