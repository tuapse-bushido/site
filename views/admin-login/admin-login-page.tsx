import { JSX } from 'react';
import { LoginForm } from '@/components/admin/login/login-form';
import styles from './admin-login-page.module.scss';

export const AdminLoginPage = (): JSX.Element => {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  );
};
