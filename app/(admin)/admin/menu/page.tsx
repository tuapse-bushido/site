import { JSX } from 'react';
import { MenuScreen } from 'modules/admin/menu/screens/menu.screen';
import { getMenuDashboardConfig } from 'modules/admin/menu/screens/menu-screen.config';
import { ingredientRepo } from 'modules/admin/menu/ingredients/repository/repo';
import { categoryRepo } from 'modules/admin/menu/categories/repository/repo';
import { productRepo } from 'modules/admin/menu/products/repository/repo';

export default async function MenuPage(): Promise<JSX.Element> {
  'use cache';

  const payload = {
    ingredients: 0,
    categories: 0,
    products: 0,
  };

  const requests = {
    ingredients: ingredientRepo.getCount(),
    categories: categoryRepo.getCount(),
    products: productRepo.getCount(),
  };

  const results = await Promise.all(
    Object.entries(requests).map(async ([key, promise]): Promise<{ key: string; value: number }> => {
      const res = await promise;
      return { key, value: res.ok ? res.data.count : 0 };
    }),
  );

  results.forEach(({ key, value }): void => {
    payload[key as keyof typeof payload] = value;
  });

  const menu = getMenuDashboardConfig(payload);

  return <MenuScreen menu={menu} />;
}
