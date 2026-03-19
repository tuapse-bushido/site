import { z } from 'zod';

const fileSchema = z.file().mime(['image/jpeg', 'image/png', 'image/webp']).max(5_120);

export const imageFileSchema = z
  .file()
  .refine(
    (file): boolean => file.size === 0 || fileSchema.safeParse(file).success,
    'Файл должен быть изображением (png, jpeg, webp) и не превышать 5MB',
  )
  .transform((file): null | File => (file.size === 0 ? null : file));

export const nonNegativeNumberSchema = z.preprocess((v): unknown => {
  if (typeof v === 'string') {
    const trimmed = v.trim();
    return trimmed === '' ? 0 : Number(trimmed);
  }
  return v;
}, z.number().nonnegative('Значение должно быть неотрицательным числом'));

export const booleanSchemaFromLabels = (labels: {
  true: string;
  false: string;
}): z.ZodType<boolean, 'true' | 'false'> =>
  z
    .enum(['true', 'false'], `Значение должно быть: ${labels.true} или ${labels.false}`)
    .transform((v): boolean => v === 'true');

export const stringToArrayNumberSchema = z.string().transform((value): number[] | null => {
  if (value.trim() === '') return null;

  return value.split(',').map((v): number => Number(v));
});
