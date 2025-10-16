import { ActionFn, FormState } from '@/types/actions/form-schemas';
import { z, ZodTypeAny } from 'zod';

export function preparedAction<T>(
  action: (prevState: FormState | null, formData: FormData, entity: T) => Promise<FormState>,
  entity: T,
): (prevState: FormState | null, formData: FormData) => Promise<FormState>;
export function preparedAction(
  action: (prevState: FormState | null, formData: FormData) => Promise<FormState>,
): (prevState: FormState | null, formData: FormData) => Promise<FormState>;
export function preparedAction<T>(action: ActionFn<T>, entity?: T) {
  return (prevState: FormState | null, formData: FormData): Promise<FormState> => {
    if (entity !== undefined) {
      return action(prevState, formData, entity);
    }

    return action(prevState, formData);
  };
}

// export function prepareData<T extends ZodTypeAny>(formData: FormData, schema: T): z.infer<T> | FormState {
//   const formObject = Object.fromEntries(formData.entries());
//   const parsed = schema.safeParse(formObject);
//
//   if (!parsed.success) {
//     const firstIssue = parsed.error.issues[0];
//     const field = String(firstIssue.path[0]);
//     return {
//       success: false,
//       fields: {
//         [field]: firstIssue.message,
//       },
//     };
//   }
//
//   return parsed.data!;
// }

type PrepareDataResult<T extends ZodTypeAny> =
  | { success: true; data: z.infer<T> }
  | { success: false; fields: Record<string, string> };

export function prepareData<T extends ZodTypeAny>(formData: FormData, schema: T): PrepareDataResult<T> {
  const formObject = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(formObject);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const field = String(firstIssue.path[0]);
    return {
      success: false,
      fields: { [field]: firstIssue.message },
    };
  }

  return { success: true, data: parsed.data };
}
