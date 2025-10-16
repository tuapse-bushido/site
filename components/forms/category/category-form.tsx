'use client';

import { JSX, useActionState } from 'react';
import { InputGroup } from '@/components/ui/input-group/input-group';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import { CategoryFormState } from '@/components/forms/category/ingredient-form.props';
import { PickedImage } from '@/components/picked-image/picked-image';
import styles from './category-form.module.scss';
import { SelectGroup } from '@/components/ui/select-group/select-group';

export const CategoryForm = ({ category, action }: CategoryFormState): JSX.Element => {
  const preparedAction = (
    prevState: { message: string; success: boolean } | null,
    formData: FormData,
  ): Promise<{
    message: string;
    success: boolean;
  }> => {
    return action(prevState, formData, category);
  };
  const [state, formAction] = useActionState(preparedAction, null);

  const router = useRouter();

  const handlerCancel = (): void => {
    router.push('/admin/menu/categories');
  };

  return (
    <Form action={formAction} className={styles.form}>
      <h1 className={styles.h1}>{category ? `Категория - ${category.title}` : 'Добавить новую категорию'}</h1>

      <InputGroup label={'Название'} id={'title'} name={'title'} defaultValue={category?.title} required />
      {!state?.success && <p>{state?.message}</p>}

      <InputGroup label={'Адрес ссылки'} id={'slug'} name={'slug'} defaultValue={category?.slug} />
      <InputGroup
        label={'Сортировочный номер'}
        id={'sort_number'}
        name={'sort_number'}
        defaultValue={category ? category.sort_number : 0}
      />

      <SelectGroup field={'is_active'} defaultValue={category?.is_active} />

      <div className={styles.image}>
        <PickedImage imageLink={category?.image_link as string} altImage={category?.title as string} />
      </div>

      <div>
        <button type={'submit'}>Ок</button>
        <button type={'button'} onClick={handlerCancel}>
          Отмена
        </button>
      </div>
    </Form>
  );
};
