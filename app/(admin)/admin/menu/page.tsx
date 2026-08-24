import { JSX } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { MenuScreen } from 'modules/admin/menu/screens';
import { menuService } from 'modules/admin/menu/services';

export default async function MenuPage(): Promise<JSX.Element> {
  'use cache';
  cacheLife('admin');
  cacheTag('admin-pages', 'menu-page');

  const stats = await menuService.getDashboardStats();

  return <MenuScreen stats={stats} />;
}
