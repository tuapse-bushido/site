'use client';

import Form from 'next/form';
import { JSX, useActionState } from 'react';
import styles from './login-form.module.scss';
import { signupAdmin } from '../../api/signup-admin';
import { Button, ErrorMessage, InputGroup } from '@/src/shared/ui/';

export const LoginForm = (): JSX.Element => {
  const [state, formAction] = useActionState(signupAdmin, null);

  return (
    <Form action={formAction} className={styles.form}>
      <InputGroup
        labelTitle={'Логин'}
        variant={'back'}
        type={'text'}
        id={'login'}
        name={'login'}
        autoComplete={'username'}
        required
      />

      <InputGroup
        labelTitle={'Пароль'}
        variant={'back'}
        type={'password'}
        id={'password'}
        name={'password'}
        autoComplete={'current-password'}
        required
      />

      {state && !state.success && state.message && <ErrorMessage text={state.message} />}

      <Button label={'Войти'} type={'primary'} />
    </Form>
  );
};
