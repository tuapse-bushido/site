import { AdminIconName } from './icon-map';

export type MenuItem = {
  id: number;
  label: string;
  link: string;
  iconName: AdminIconName;
};

export const menu: MenuItem[] = [
  {
    id: 1,
    label: 'Панель',
    link: '/admin/dashboard',
    iconName: 'dashboard',
  },
  {
    id: 2,
    label: 'Заказы',
    link: '/admin/orders',
    iconName: 'orders',
  },
  {
    id: 3,
    label: 'Меню',
    link: '/admin/menu',
    iconName: 'menu',
  },
  {
    id: 4,
    label: 'Правила и добавки',
    link: '/admin/rules',
    iconName: 'rules',
  },
];
