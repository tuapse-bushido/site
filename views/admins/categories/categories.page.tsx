import Link from 'next/link';
import { JSX } from 'react';
import { getAllCategories } from '@/libs/db/category/category.query';
import { TableComponent } from '@/components/ui/table/table';
import { categoryColumns, titleColumns } from '@/utils/configs/table-columns';

export const CategoriesPage = async (): Promise<JSX.Element | null> => {
  const response = await getAllCategories();

  if (!response.success) return null;

  return (
    <div>
      <h1>Категории</h1>
      <Link href="/admin/menu/categories/create">Добавить ингредиент</Link>

      <TableComponent
        data={response.data}
        mapColumns={categoryColumns}
        slug={'categories'}
        titleColumns={titleColumns}
      />
    </div>
  );
};
