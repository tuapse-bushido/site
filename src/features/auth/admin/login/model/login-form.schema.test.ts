import { describe, expect, it } from 'vitest';
import { loginFormSchema } from './login-form.schema';

describe('loginFormSchema', (): void => {
  it('валидные данные', (): void => {
    const result = loginFormSchema.safeParse({
      login: 'admin',
      password: '1234',
    });
    expect(result.success).toBe(true);
  });

  it('не пропускает пустой логин', (): void => {
    const result = loginFormSchema.safeParse({
      login: '',
      password: '1234',
    });
    expect(result.success).toBe(false);
  });

  it('не пропускает логин из пробелов', (): void => {
    const result = loginFormSchema.safeParse({
      login: '   ',
      password: '1234',
    });
    expect(result.success).toBe(false);
  });

  it('не пропускает пустой пароль', (): void => {
    const result = loginFormSchema.safeParse({
      login: 'admin',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('не пропускает пароль из пробелов', (): void => {
    const result = loginFormSchema.safeParse({
      login: 'admin',
      password: '   ',
    });
    expect(result.success).toBe(false);
  });
});
