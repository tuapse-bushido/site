import { JSX } from 'react';
import styles from './styles.module.scss';
import { LoginForm } from '@/src/modules/admin/admin-auth';

export default function AdminLoginPage(): JSX.Element {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  );
}
