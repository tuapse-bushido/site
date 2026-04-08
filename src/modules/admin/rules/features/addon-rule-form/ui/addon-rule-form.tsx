'use client';

import { JSX, useActionState } from 'react';
import { MuiPaper } from 'shared/ui/mui';
import { FormHeader } from './form-header';
import { FormAction } from './form-action';
import { GeneralInfo } from './general-info';
import { usePathname } from 'next/navigation';
import { RelationSettings } from './relation-settings';
import { AddonRuleEditData } from 'modules/admin/rules/entities';
import { upsertAddonRuleAction } from '../api/upsert-addon-rule.action';

type Props = {
  ruleData: AddonRuleEditData;
};

export const AddonRuleForm = ({ ruleData }: Props): JSX.Element => {
  const pathname = usePathname();

  const { addonRule: rule, categories, products } = ruleData;

  const boundAction = upsertAddonRuleAction.bind(null, rule?.id ? rule.id : null);
  const [_state, formAction] = useActionState(boundAction, null);

  return (
    <MuiPaper key={pathname} component={'form'} action={formAction}>
      {rule?.id && <input type="hidden" name="id" value={rule.id} />}

      <FormHeader title={rule?.title} isActive={rule?.is_active} />
      <GeneralInfo
        title={rule?.title}
        baseCount={rule?.base_count}
        divisor={rule?.divisor}
        showCountPercent={rule?.show_count_percent}
      />
      <RelationSettings rule={rule} categories={categories} products={products} />

      <FormAction id={rule?.id} />
    </MuiPaper>
  );
};
