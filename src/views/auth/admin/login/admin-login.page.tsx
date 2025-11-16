import { JSX } from 'react';
import { LoginForm } from '@/src/features/auth/admin/login/ui/login-form/login-form';
import styles from './admin-login.module.scss';

export const AdminLoginPage = (): JSX.Element => {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  );
};
