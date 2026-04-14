import { JSX } from 'react';
import { getAddonRuleEditData } from 'modules/admin/rules/use-cases';
import { AddonRuleForm } from 'modules/admin/rules/features/addon-rule-form/ui';

export default async function CreateRulesPage(): Promise<JSX.Element | null> {
  const ruleData = await getAddonRuleEditData();

  if (!ruleData.ok) return null;

  return <AddonRuleForm ruleData={ruleData.data} />;
}
