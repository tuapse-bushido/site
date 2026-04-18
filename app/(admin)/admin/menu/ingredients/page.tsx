import { JSX } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { ingredientRepo } from 'modules/admin/menu/ingredients/repository';
import { IngredientsScreen } from 'modules/admin/menu/ingredients';

export default async function IngredientsPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');
  cacheTag('admin-pages', 'ingredients-page');

  const ingredients = await ingredientRepo.getAllIngredients();

  if (!ingredients.ok) return null;

  return <IngredientsScreen ingredients={ingredients.data} />;
}
