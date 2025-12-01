import { z } from 'zod';

export const loginFormSchema = z.object({
  login: z.string().trim().min(1, 'Введите логин'),
  password: z.string().trim().min(1, 'Введите пароль'),
});
