import { JSX } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { productRepo } from 'modules/admin/menu/products/repository';
import { ProductsScreen } from 'modules/admin/menu/products/screens';

export default async function ProductsPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');
  cacheTag('admin-pages', 'products-page');

  const products = await productRepo.getAllProducts();

  if (!products.ok) return null;

  return <ProductsScreen products={products.data} />;
}
