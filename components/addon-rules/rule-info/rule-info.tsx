'use client';
import { JSX, useState } from 'react';
import { AddonRuleFull } from '@/types';
import styles from './rule-info.module.scss';
import { Divider } from '@/components/cart/divider/divider';
import { LinkButton } from '@/components/ui/link-button/link-button';
import { Button } from '@/components/ui/button/button';
import { DeleteRuleForm } from '@/components/forms/rule/delete-rule/delete-rule.form';

export const RuleInfo = ({ rule }: { rule: AddonRuleFull }): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={styles.wrapper}>
      <h2>Информация о правиле:</h2>
      <Divider direction={'horizontal'} />
      <div className={styles.btnWrapper}>
        <LinkButton href={`/admin/rules/edit/${rule.id}`} label={'Редактировать правило'} type={'primary'} />
        <Button label={'Удалить правило'} type={'rule'} onClick={(): void => setShowModal(true)} />
      </div>
      <span>Название - {rule.title}</span>
      <span>Количество добавки - {rule.base_count}</span>
      <span>Делитель - {rule.divisor}</span>
      <span>Процент отображения - {rule.show_count_percent}</span>
      <span>Состояние - {rule.is_active}</span>

      <h2>Продукты добавки</h2>
      {rule.addon_products.map(
        (product): JSX.Element => (
          <div key={product.addon_product_id + product.addon_product_title}>
            <span>{product.addon_product_id}</span>
            <span>{product.addon_product_title}</span>
          </div>
        ),
      )}
      <div id="modal-root" />
      {showModal && <DeleteRuleForm rule={rule} onCloseAction={(): void => setShowModal(false)} />}
    </div>
  );
};
