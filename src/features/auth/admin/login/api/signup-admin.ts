'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { startSession } from '@/libs/session/session';
import { formError, parsedFormData } from '@/src/shared/utils/form.utils';
import { ErrorCode, FormState } from '@/src/shared/types';
import { loginFormSchema } from '../model/login-form.schema';
import { getByNicknameAdmin } from '@/src/entities/admin/api/getByNicknameAdmin';

export const signupAdmin = async (_prevState: FormState | null, formData: FormData): Promise<FormState> => {
  const parsed = parsedFormData(formData, loginFormSchema);

  if (!parsed.success) return formError({ ...{ code: ErrorCode.INVALID_INPUT } });

  const { login, password } = parsed.data;

  const response = await getByNicknameAdmin(login.toString());

  if (!response.ok) return formError({ message: response.message });

  const { data: admin } = response;

  if (!(await bcrypt.compare(password.toString(), admin.password_hash))) {
    return formError({ code: ErrorCode.INVALID_CREDENTIALS });
  }

  await startSession(admin);
  redirect('/admin/dashboard');
};
