'use server';
import { FormState, ruleCreateSchema, ruleIdSchema, ruleUpdateSchema } from '@/types/actions/form-schemas';
import { deleteAddonRuleById, insertFullRule, updateFullRule } from '@/libs/db/addons/addons.query';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const actionInsertRule = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
  const formObject = Object.fromEntries(formData.entries());
  const parsed = ruleCreateSchema.safeParse(formObject);

  if (!parsed.success)
    return {
      success: false,
      message: 'Неверные данные',
    };

  const response = await insertFullRule(parsed.data);

  if (!response.success)
    return {
      success: false,
      message: response.message,
    };

  revalidatePath('/');
  revalidatePath('/admin/rules');
  // revalidateTag('productCard');
  redirect('/admin/rules');
};

export const actionUpdateRule = async (prevState: FormState, formData: FormData): Promise<FormState> => {
  const formObject = Object.fromEntries(formData.entries());
  const parsed = ruleUpdateSchema.safeParse(formObject);

  if (!parsed.success)
    return {
      success: false,
      message: 'Неверные данные',
    };

  const response = await updateFullRule(parsed.data);

  if (!response.success)
    return {
      success: false,
      message: response.message,
    };

  revalidatePath('/');
  revalidatePath('/admin/rules');
  // revalidateTag('productCard');
  redirect('/admin/rules');
};

export const actionDeleteRule = async (prevState: FormState, formData: FormData): Promise<FormState> => {
  const formObject = Object.fromEntries(formData.entries());
  const parsed = ruleIdSchema.safeParse(formObject);

  if (!parsed.success)
    return {
      success: false,
      message: 'Неверные данные',
    };

  const { id: rule_id } = parsed.data;
  const response = await deleteAddonRuleById(Number(rule_id));

  if (!response.success)
    return {
      success: false,
      message: response.message,
    };

  revalidatePath('/');
  revalidatePath('/admin/rules');
  // revalidateTag('productCard');

  return {
    success: true,
    message: 'Правило удалено',
  };
};
