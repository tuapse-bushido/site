'use client';

import { JSX, useActionState } from 'react';
import { IngredientFormProps } from '@/components/forms/ingredient/ingredient-form.props';
import { InputGroup } from '@/components/ui/input-group/input-group';
import Form from 'next/form';
import styles from './ingredient-form.module.scss';
import Link from 'next/link';
import { Button } from '@/components/ui/button/button';

export const IngredientForm = ({ ingredient, action }: IngredientFormProps): JSX.Element => {
  const [state, formAction] = useActionState(action, null);

  return (
    <Form action={formAction} className={styles.form}>
      {ingredient ? <h1>{ingredient.title}</h1> : <h1>Новый ингредиент</h1>}

      <InputGroup
        label={'Название'}
        id={'title'}
        name={'title'}
        defaultValue={ingredient?.title}
        wrapperClassName={styles.wrapperGroup}
        labelClassName={styles.label}
        inputClassName={styles.input}
      />
      {state && !state.success && <p>{state?.fields?.title}</p>}

      <div className={styles.buttonGroup}>
        <Button type="primary" label={'Сохранить'} />
        <Link href={'/admin/menu/ingredients'} className={styles.linkButton}>
          Отмена
        </Link>
      </div>
    </Form>
  );
};
