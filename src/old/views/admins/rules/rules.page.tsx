import { JSX } from 'react';
import styles from './rules.module.scss';
import { ClientRulesWrapper } from '@/components/addon-rules/rules-wrapper/rules-wrapper';
import { getAllAddonRuleFull } from '@/libs/db/addons/addons.query';
import { LinkButton } from '@/components/ui/link-button/link-button';
import { AdminPageHeader } from '@/components/admin/admin-page-header/admin-page.header';

export const RulesPage = async (): Promise<JSX.Element | null> => {
  const response = await getAllAddonRuleFull();

  if (!response.success) return null;
  const { data: rules } = response;

  return (
    <div className={styles.page}>
      <AdminPageHeader title={'Правила и добавки'} />
      <LinkButton href={'/admin/rules/create'} label={'Добавить правило'} type={'primary'} />
      <ClientRulesWrapper rules={rules} />
    </div>
  );
};
