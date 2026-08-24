import { JSX } from 'react';
import { PageContainer } from 'modules/admin/shared/ui/page-container';
import { AddonRuleForm } from 'modules/admin/rules/widgets/addon-rule-form';
import { addonRuleCases } from 'modules/admin/rules/use-cases';

export const CreateAddonRuleScreen = async (): Promise<JSX.Element | null> => {
  const result = await addonRuleCases.getAddonRuleEditData();

  if (!result.ok) return null;

  return (
    <PageContainer title={'Новое правило'}>
      <AddonRuleForm addonRuleData={result.data} />
    </PageContainer>
  );
};
