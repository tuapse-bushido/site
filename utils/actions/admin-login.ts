'use server';

import { getByNickname } from '@/libs/db/queries/admin-users/get-by-nickname';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { startSession } from '@/libs/session/session';

// export const signupAdmin = async (formData: FormData): Promise<void | { success: boolean; error: string }> => {
//   const login = formData.get('login') ?? '';
//   const password = formData.get('password') ?? '';
//
//   const admin = await getByNickname(login.toString());
//   if (!admin || !(await bcrypt.compare(password.toString(), admin.password_hash))) {
//     return { success: false, error: 'Неверный логин или пароль' };
//   }
//   await startSession(admin);
//
//   redirect('/admin/dashboard');
// };

export const signupAdmin = async (formData: FormData): Promise<void> => {
  const login = formData.get('login') ?? '';
  const password = formData.get('password') ?? '';

  const admin = await getByNickname(login.toString());
  if (!admin || !(await bcrypt.compare(password.toString(), admin.password_hash))) {
    // ❌ не возвращаем объект
    // ✅ кидаем ошибку или делаем redirect на страницу с сообщением
    redirect('/admin/login?error=Неверный%20логин%20или%20пароль');
  }

  await startSession(admin);
  redirect('/admin/dashboard');
};
