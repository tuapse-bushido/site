import { z } from 'zod';
import { Order } from '@/types/db/tables/order';

type FormFields = 'title' | 'price' | 'general' | 'sms_code';

export type FormState = {
  success: boolean;
  fields?: Partial<Record<FormFields, string>>;
  message?: string | Order;
} | null;

export type ActionFn<T = unknown> = (prevState: FormState | null, formData: FormData, entity?: T) => Promise<FormState>;

export const ingredientFormSchema = z.object({
  title: z.string().trim().min(1, 'Название обязательное поле').max(50, 'Название не может превышать 50 символов'),
});

export const pickupFormSchema = z.object({
  name: z.string().min(1, 'Укажите имя'),
  phone: z.string().min(1, 'Укажите телефон'),

  order_type: z.enum(['delivery', 'pickup']),
  payment_type: z.enum(['courier', 'pickup']),
});

export const deliveryFormSchema = pickupFormSchema.extend({
  city: z.string().min(1, 'Укажите город'),
  street: z.string().min(1, 'Укажите улицу'),
  house: z.string().min(1, 'Укажите номер дома'),

  apartment: z.string(),
  floor: z.string(),
  entrance: z.string(),
  intercom: z.string(),
});

export const smsFormSchema = z.object({
  sms_code: z.string().regex(/^\d{6}$/, 'Неверный код'),
});

// Rule Schemas
export const ruleIdSchema = z.object({
  id: z.string(),
});

export const ruleCreateSchema = z.object({
  title: z.string(),
  base_count: z.string(),
  divisor: z.string(),
  show_count_percent: z.string(),
  is_active: z.preprocess((val): boolean => val === 'true', z.boolean()),

  addon_products: z.preprocess(
    (val): [] | number[] =>
      (typeof val === 'string' ? [val] : Array.isArray(val) ? val : [])
        .filter((v): boolean => v.trim() !== '')
        .map((v): number => Number(v)),
    z.array(z.number()),
  ),
  categories: z.preprocess(
    (val): [] | number[] =>
      (typeof val === 'string' ? [val] : Array.isArray(val) ? val : [])
        .filter((v): boolean => v.trim() !== '')
        .map((v): number => Number(v)),
    z.array(z.number()),
  ),
  products: z.preprocess(
    (val): [] | number[] =>
      (typeof val === 'string' ? [val] : Array.isArray(val) ? val : [])
        .filter((v): boolean => v.trim() !== '')
        .map((v): number => Number(v)),
    z.array(z.number()),
  ),
});
export type RuleCreate = z.infer<typeof ruleCreateSchema>;

export const ruleUpdateSchema = ruleIdSchema.merge(ruleCreateSchema);
export type RuleUpdate = z.infer<typeof ruleUpdateSchema>;
