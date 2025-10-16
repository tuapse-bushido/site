import { JSX } from 'react';
import { AddonRuleFull } from '@/types';
import styles from './rule-item.module.scss';

export const RuleItem = ({
  rule,
  index,
  onClick,
}: {
  rule: AddonRuleFull;
  index: number;
  onClick: () => void;
}): JSX.Element => {
  return (
    <div className={styles.item} onClick={onClick}>
      <span>{index}.</span>
      <span>{rule.title}</span>
    </div>
  );
};
