'use client';

import Form from 'next/form';
import { loginAction } from '../../api';
import { JSX, useActionState } from 'react';
import styles from './login-form.module.scss';
import { InputGroup } from 'modules/client/shared/ui';

type Props = {
  returnTo: string | undefined;
};

export const LoginForm = ({ returnTo }: Props): JSX.Element => {
  const [, formAction] = useActionState(loginAction, null);

  return (
    <Form action={formAction} className={styles.form}>
      <input type="hidden" name="returnTo" value={returnTo ?? '/admin/orders'} />

      <InputGroup labelTitle={'Логин'} type={'text'} id={'login'} name={'login'} autoComplete={'username'} required />

      <InputGroup
        labelTitle={'Пароль'}
        type={'password'}
        id={'password'}
        name={'password'}
        autoComplete={'current-password'}
        required
      />

      <button className={'btn btnPrimary'}>Войти</button>
    </Form>
  );
};
