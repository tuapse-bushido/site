import { z } from 'zod';

const returnToSchema = z
  .string()
  .trim()
  .refine(
    (path): boolean => (path === '/admin' || path.startsWith('/admin/')) && !path.startsWith('/admin/login'),
    'Некорректный путь перенаправления',
  )
  .optional();

export const loginFormSchema = z.object({
  login: z.string().trim().min(1, 'Введите логин'),
  password: z.string().trim().min(1, 'Введите пароль'),
  returnTo: returnToSchema,
});
