'use server';

import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { addonRuleCases } from 'modules/admin/rules/use-cases';
import { formError, parsedFormDataNew } from 'modules/admin/shared/utils/form.utils';
import { invalidateAddonRuleCache } from 'modules/admin/shared/utils/cache-invalidation.utils';
import { addonRuleSchemas as schemas, UpsertFormAddonRule } from 'modules/admin/rules/entities';

export const addonRuleAction = async (
  ruleId: number | null,
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<UpsertFormAddonRule>> => {
  const { schema, extraData } = ruleId
    ? { schema: schemas.form.update, extraData: { id: ruleId } }
    : { schema: schemas.form.create, extraData: {} };

  const parsed = parsedFormDataNew(formData, schema, extraData);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const response = await addonRuleCases.upsertAddonRuleCase(parsed.data, ruleId ? 'update' : 'insert');

  if (!response.ok) return formError({ code: response.code });

  invalidateAddonRuleCache();

  redirect(`/admin/rules`);
};

export const deleteAddonRuleAction = async (ruleId: number): Promise<FormState<null>> => {
  const response = await addonRuleCases.deleteAddonRuleCase(ruleId);

  if (!response.ok) return formError({ code: response.code });

  invalidateAddonRuleCache();

  redirect(`/admin/rules`);
};
