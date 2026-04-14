'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { addonRulesService } from 'modules/admin/rules/services/addon-rules.service';
import { formError } from 'modules/admin/shared/utils/form.utils';

export const deleteAddonRuleAction = async (ruleId: number): Promise<FormState<null>> => {
  const response = await addonRulesService.syncDeleteAddonRule(ruleId);

  if (!response.ok) return formError({ code: response.code });

  updateTag('addon-rules');
  updateTag(`addon-rule-${ruleId}`);

  redirect(`/admin/rules/`);
};
