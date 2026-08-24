import { JSX } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { CategoriesScreen } from 'modules/admin/menu/categories';
import { categoryRepo } from 'modules/admin/menu/categories/repository';

export default async function CategoriesPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');
  cacheTag('admin-pages', 'categories-page');

  const categories = await categoryRepo.getAllCategories();

  if (!categories.ok) return null;

  return <CategoriesScreen categories={categories.data} />;
}
