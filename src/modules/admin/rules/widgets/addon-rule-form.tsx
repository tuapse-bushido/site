import { JSX } from 'react';
import { AddonRuleEditData } from 'modules/admin/rules/entities';
import { FormResetContainer } from 'modules/admin/shared/ui/form-reset-container';
import { AddonRuleFormContent } from 'modules/admin/rules/features/addon-rule-form-content';

type Props = {
  addonRuleData: AddonRuleEditData;
};

export const AddonRuleForm = ({ addonRuleData }: Props): JSX.Element => {
  return (
    <FormResetContainer>
      <AddonRuleFormContent addonRuleData={addonRuleData} />
    </FormResetContainer>
  );
};
