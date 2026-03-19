'use client';
import { JSX, useActionState, useEffect } from 'react';
import Form from 'next/form';
import { Modal } from '@/components/ui/modal/modal';
import { AdminPageHeader } from '@/components/admin/admin-page-header/admin-page.header';
import { Button } from '@/components/ui/button/button';
import { AddonRuleFull } from '@/types';
import { actionDeleteRule } from '@/utils/actions/addons.action';
import styles from './delete-rule.module.scss';

export const DeleteRuleForm = ({
  rule,
  onCloseAction,
}: {
  rule: AddonRuleFull;
  onCloseAction: () => void;
}): JSX.Element => {
  const [state, formAction] = useActionState(actionDeleteRule, null);

  useEffect((): void => {
    if (state?.success) {
      onCloseAction();
    }
  }, [state?.success, onCloseAction]);

  return (
    <Modal onClose={onCloseAction}>
      <Form action={formAction} className={styles.form}>
        <input type="hidden" name={'id'} value={rule.id} />

        <AdminPageHeader title={'Удалить правило'} />

        <p className={styles.p}>
          Подтвердите удаление правила - <span className={styles.ruleTitle}>{rule.title}</span>
        </p>
        {state?.message && typeof state.message === 'string' && <p>{state.message}</p>}

        <div className={styles.btnWrapper}>
          <Button label={'Подтвердить'} type={'rule'} />
          <Button
            label={'Отмена'}
            type={'cancel'}
            onClick={(e): void => {
              e.preventDefault();
              onCloseAction();
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};
