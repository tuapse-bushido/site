export type ParsedFormResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: Partial<Record<keyof T, string[]>> };

export type FormState<T = unknown> = {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof T, string[]>>;
};
