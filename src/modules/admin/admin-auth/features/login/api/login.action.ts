'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { ErrorCode } from 'shared/types/error-codes.types';
import { adminRepo } from 'modules/admin/shared/repository';
import { loginFormSchema } from 'modules/admin/admin-auth/features';
import { sessionService } from 'modules/admin/admin-auth/services';
import { formError, parsedFormDataNew } from 'modules/admin/shared/utils/form.utils';

export const loginAction = async (_prevState: FormState | null, formData: FormData): Promise<FormState> => {
  const parsed = parsedFormDataNew(formData, loginFormSchema);

  if (!parsed.success) return formError({ ...{ code: ErrorCode.INVALID_INPUT } });

  const { login, password, returnTo } = parsed.data;

  const response = await adminRepo.getAdminByLogin(login.toString());

  if (!response.ok) return formError({ message: response.message });

  const { data: admin } = response;

  if (!(await bcrypt.compare(password.toString(), admin.password_hash))) {
    return formError({ code: ErrorCode.INVALID_CREDENTIALS });
  }

  const sessionResult = await sessionService.startSession(admin);

  if (!sessionResult.ok) {
    return formError({ message: sessionResult.message });
  }

  redirect(returnTo ?? '/admin/orders');
};
