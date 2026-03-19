'use client';
import { JSX, useState } from 'react';
import { AddonRuleFull } from '@/types';
import { RulesList } from '@/components/addon-rules/rules-list/rule-list';
import { RuleInfo } from '@/components/addon-rules/rule-info/rule-info';
import styles from './rules-wrapper.module.scss';
import { Divider } from '@/components/cart/divider/divider';
import { AttachedProducts } from '@/components/addon-rules/attached-products/attached-products';

export const ClientRulesWrapper = ({ rules }: { rules: AddonRuleFull[] }): JSX.Element => {
  const [ruleInfo, setRuleInfo] = useState<AddonRuleFull | null>(null);
  const handleRuleClick = (rule: AddonRuleFull): void => {
    setRuleInfo(rule);
  };

  return (
    <div className={styles.wrapper}>
      <RulesList rules={rules} onClick={handleRuleClick} />
      <Divider direction={'vertical'} />

      {ruleInfo && (
        <>
          <RuleInfo rule={ruleInfo} />
          <Divider direction={'vertical'} />
          <AttachedProducts categories={ruleInfo.attached_categories} products={ruleInfo.attached_products} />
        </>
      )}
    </div>
  );
};
