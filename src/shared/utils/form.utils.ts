import { z, ZodType } from 'zod';
import { ErrorCode, errorMessages, FormState, ParsedFormResult } from '@/src/shared/types';

export function parsedFormData<T extends ZodType>(formData: FormData, schema: T): ParsedFormResult<z.infer<T>> {
  const obj = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(obj);

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return { success: false, fieldErrors };
  }

  return { success: true, data: parsed.data };
}

/**
 * Универсальная функция для успешного состояния формы
 */
export const formSuccess = <T>(message?: string): FormState<T> => ({
  success: true,
  ...(message ? { message } : {}),
});

/**
 * Универсальная функция для ошибки формы
 */
export function formError<T>({
  code,
  message,
  fieldErrors,
}: {
  code?: ErrorCode;
  message?: string;
  fieldErrors?: Partial<Record<keyof T, string[]>>;
} = {}): FormState<T> {
  const finalMessage = message ?? (code ? errorMessages[code] : undefined);

  return {
    success: false,
    ...(finalMessage ? { message: finalMessage } : {}),
    ...(fieldErrors ? { fieldErrors } : {}),
  };
}
