'use client';

import { JSX, useActionState } from 'react';
import { InputGroup } from '@/components/ui/input-group/input-group';
import { SelectGroup } from '@/components/ui/select-group/select-group';
import { Button } from '@/components/ui/button/button';
import Link from 'next/link';
import Form from 'next/form';
import { RuleFormProps } from '@/components/forms/rule/rule.props';
import { ProductOptions } from '@/components/ui/select-group/select-group.props';

export const RuleForm = ({ rule, categories, products, action }: RuleFormProps): JSX.Element => {
  const defaultAddons = rule?.addon_products?.map(
    (addon): ProductOptions => ({
      id: addon.addon_product_id,
      title: addon.addon_product_title,
    }),
  );

  const defaultProducts = rule?.attached_products?.map(
    (product): ProductOptions => ({
      id: product.product_id,
      title: product.product_title,
    }),
  );

  const defaultCategories = rule?.attached_categories?.map(
    (category): ProductOptions => ({
      id: category.category_id,
      title: category.category_title,
    }),
  );

  const [formState, formAction] = useActionState(action, null);

  return (
    <>
      <Form action={formAction}>
        {rule?.id && <input type="hidden" name="id" value={rule.id} />}

        <InputGroup label={'Название правила'} id={'addon-group'} name={'title'} defaultValue={rule?.title} required />
        {formState?.message && typeof formState?.message === 'string' && <p>{formState?.message}</p>}

        <InputGroup
          label={'Добавляемое количество, шт'}
          id={'base_count'}
          name={'base_count'}
          defaultValue={rule?.base_count ?? 1}
          required
        />

        <InputGroup label={'Делитель, шт'} id={'divisor'} name={'divisor'} defaultValue={rule?.divisor ?? 1} required />

        <InputGroup
          label={'Начальное отображение, %'}
          id={'show_count_percent'}
          name={'show_count_percent'}
          defaultValue={rule?.show_count_percent ?? 50}
          required
        />

        <SelectGroup field={'is_active'} defaultValue={rule?.is_active} label={'Состояние'} />

        <SelectGroup
          defaultValue={defaultAddons}
          options={products}
          field={'addon_products'}
          label={'Продукт добавка'}
        />
        <SelectGroup defaultValue={defaultCategories} options={categories} field={'categories'} label={'Категории'} />
        <SelectGroup defaultValue={defaultProducts} options={products} field={'products'} label={'Блюда'} />

        <Button label={'Сохранить'} type={'primary'} />
        <Link href={'/admin/menu/addons'}>Отмена</Link>
      </Form>
    </>
  );
};
