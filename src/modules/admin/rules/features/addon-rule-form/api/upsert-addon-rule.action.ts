'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { upsertAddonRuleCase } from 'modules/admin/rules/use-cases';
import { addonRuleFormSchemas as schemas, UpsertAddonRuleForm } from '../model';
import { formError, parsedFormDataNew } from 'modules/admin/shared/utils/form.utils';

export const upsertAddonRuleAction = async (
  ruleId: number | null,
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<UpsertAddonRuleForm>> => {
  const { schema, extraData } = ruleId
    ? { schema: schemas.update, extraData: { id: ruleId } }
    : { schema: schemas.create, extraData: {} };

  const parsed = parsedFormDataNew(formData, schema, extraData);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const response = await upsertAddonRuleCase(parsed.data, ruleId ? 'update' : 'insert');

  if (!response.ok) return formError({ code: response.code });

  const id = response.data.id;

  updateTag('addon-rules');
  updateTag(`addon-rule-${id}`);

  redirect(`/admin/rules/${id}`);
};
