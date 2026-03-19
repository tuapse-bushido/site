import { z, ZodType } from 'zod';
import { FormState, ParsedFormResult } from 'shared/types/form.types';
import { ErrorCode, errorMessages } from 'shared/types/error-codes.types';

export function parsedFormData<T extends ZodType>(formData: FormData, schema: T): ParsedFormResult<z.infer<T>> {
  const obj = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(obj);

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return { success: false, fieldErrors, data: obj as Partial<z.infer<T>> };
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
  data,
}: {
  code?: ErrorCode;
  message?: string;
  fieldErrors?: Partial<Record<keyof T, string[]>>;
  data?: Partial<T>;
} = {}): FormState<T> {
  const finalMessage = message ?? (code ? errorMessages[code] : undefined);

  return {
    success: false,
    ...(finalMessage ? { message: finalMessage } : {}),
    ...(fieldErrors ? { fieldErrors } : {}),
    ...(data ? { data: data } : {}),
  };
}
