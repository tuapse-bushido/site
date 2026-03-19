import { Category } from '@/types';

export type FormAction<TEntity = undefined> = (
  prevState: { message: string; success: boolean } | null,
  formData: FormData,
  entity?: TEntity,
) => Promise<{ message: string; success: boolean }>;

export type CategoryFormState = {
  category?: Category;
  action: FormAction<Category>;
};

// export type CategoryFormState = {
//   category?: Category;
//   action: (
//     prevState: {
//       message: string;
//       success: boolean;
//     } | null,
//     formData: FormData,
//     category?: Category,
//   ) => Promise<{ message: string; success: boolean }>;
// };
