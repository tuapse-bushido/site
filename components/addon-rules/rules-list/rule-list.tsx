import { JSX } from 'react';
import { AddonRuleFull } from '@/types';
import { RuleItem } from '@/components/addon-rules/rule-item/rule-item';
import styles from './rule-list.module.scss';
import { Divider } from '@/components/cart/divider/divider';

export const RulesList = ({
  rules,
  onClick,
}: {
  rules: AddonRuleFull[];
  onClick: (rule: AddonRuleFull) => void;
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <h2>Список правил:</h2>
      <Divider direction={'horizontal'} />

      <div className={styles.list}>
        {rules.map(
          (rule, index): JSX.Element => (
            <RuleItem key={rule.id} rule={rule} index={index + 1} onClick={(): void => onClick(rule)} />
          ),
        )}
      </div>
    </div>
  );
};
