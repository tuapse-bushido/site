'use client';

import { JSX, useActionState, useState } from 'react';
import { InputGroup } from '@/components/ui/input-group/input-group';
import Form from 'next/form';
import styles from './product.module.scss';
import Link from 'next/link';
import { Button } from '@/components/ui/button/button';
import { SelectGroup } from '@/components/ui/select-group/select-group';
import { PickedImage } from '@/components/picked-image/picked-image';
import { ProductProps } from '@/components/forms/product/product.props';

export const ProductForm = ({ product, action, categories, ingredients, products }: ProductProps): JSX.Element => {
  const preparedAction = (
    prevState: { message: string; success: boolean } | null,
    formData: FormData,
  ): Promise<{
    message: string;
    success: boolean;
  }> => {
    return action(prevState, formData, product);
  };
  const [state, formAction] = useActionState(preparedAction, null);
  const [isSet, setIsSet] = useState<boolean>(product?.is_set ?? false);

  return (
    <Form action={formAction} className={styles.form}>
      <h1 className={styles.h1}>{product ? `Блюдо - ${product.title}` : 'Добавить новое блюдо'}</h1>

      <InputGroup label={'Название'} id={'title'} name={'title'} defaultValue={product?.title} required />
      {!state?.success && <p>{state?.message}</p>}

      <InputGroup label={'Адрес ссылки'} id={'slug'} name={'slug'} defaultValue={product?.slug} />
      <InputGroup label={'Цена'} id={'price'} name={'price'} defaultValue={product ? product.price : 0} />
      <InputGroup label={'Вес'} id={'weight'} name={'weight'} defaultValue={product ? product.weight : 0} />
      <InputGroup
        label={'Количество порций'}
        id={'count_portion'}
        name={'count_portion'}
        defaultValue={product ? product.count_portion : 0}
      />
      <InputGroup
        label={'Количество блюд'}
        id={'quantity'}
        name={'quantity'}
        defaultValue={product ? product.quantity : 1}
      />

      <SelectGroup
        id={'categories'}
        label={'Категория'}
        field={'categories'}
        defaultValue={product?.categories}
        options={categories}
      />

      <SelectGroup
        id={'ingredients'}
        label={'Ингредиенты'}
        field={'ingredients'}
        defaultValue={product?.ingredients}
        options={ingredients}
      />

      <InputGroup
        label={'Это сет?'}
        id={'is_set'}
        name={'is_set'}
        type={'checkbox'}
        checked={isSet}
        onChange={(e): void => setIsSet(e.target.checked)}
      />
      <input name={'is_set'} type={'hidden'} defaultValue={String(isSet)} />
      <SelectGroup
        id={'set'}
        label={'Сет'}
        field={'set'}
        defaultValue={product?.set_items}
        options={products}
        isDisabled={!isSet}
      />

      <SelectGroup id={'is_active'} label={'Доступность'} field={'is_active'} defaultValue={product?.is_active} />

      <SelectGroup id={'is_visible'} label={'Видимость'} field={'is_visible'} defaultValue={product?.is_visible} />

      <div className={styles.image}>
        <PickedImage imageLink={product?.image_link as string} altImage={product?.title as string} />
      </div>

      <div className={styles.buttonGroup}>
        <Button type="primary" label={'Сохранить'} />
        <Link href={'/admin/menu/ingredients'} className={styles.linkButton}>
          Отмена
        </Link>
      </div>
    </Form>
  );
};
