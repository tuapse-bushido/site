import { JSX } from 'react';
import Link from 'next/link';
import { TableComponent } from '@/components/ui/table/table';
import { productColumns, titleColumns } from '@/utils/configs/table-columns';
import { getAllProducts } from '@/libs/db/product/products.query';
import { Product } from '@/types';

export const ProductsPage = async (): Promise<JSX.Element | null> => {
  const products = await getAllProducts();

  if (!products.success) return null;

  return (
    <div>
      <h1>Ингредиенты</h1>
      <Link href="/admin/menu/products/create" className="bg-blue-500 text-white px-4 py-2 rounded">
        Добавить ингредиент
      </Link>
      <Link href="/admin/menu/products/5" className="bg-blue-500 text-white px-4 py-2 rounded">
        Обновить
      </Link>

      <TableComponent<Product>
        data={products.data}
        mapColumns={productColumns}
        slug={'products'}
        titleColumns={titleColumns}
      />
    </div>
  );
};
