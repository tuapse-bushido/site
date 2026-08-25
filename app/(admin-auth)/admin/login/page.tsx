import { JSX } from 'react';
import styles from './styles.module.scss';
import { LoginForm } from 'modules/admin/admin-auth/features';

type Props = {
  searchParams: Promise<{
    returnTo?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: Props): Promise<JSX.Element> {
  const { returnTo } = await searchParams;
  return (
    <div className={styles.page}>
      <LoginForm returnTo={returnTo} />
    </div>
  );
}
