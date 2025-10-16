import { JSX } from 'react';
import { InputGroup } from '@/components/ui/input-group/input-group';
import styles from './login-form.module.scss';
import { Button } from '@/components/ui/button/button';
import Form from 'next/form';
import { signupAdmin } from '@/utils/actions/admin-login';

export const LoginForm = (): JSX.Element => {
  return (
    <Form action={signupAdmin} className={styles.form}>
      <InputGroup
        label={'Логин'}
        type={'text'}
        id={'login'}
        name={'login'}
        required
        wrapperClassName={styles.wrapperInputGroup}
        labelClassName={styles.inputLabel}
        inputClassName={styles.input}
      />
      <InputGroup
        label={'Пароль'}
        type={'password'}
        id={'password'}
        name={'password'}
        required
        wrapperClassName={styles.wrapperInputGroup}
        labelClassName={styles.inputLabel}
        inputClassName={styles.input}
      />

      <Button label={'Войти'} type={'primary'} />
    </Form>
  );
};
