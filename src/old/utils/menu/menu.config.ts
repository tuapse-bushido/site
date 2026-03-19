export type MenuItem = {
  id: number;
  label: string;
  link: string;
  children?: MenuItem[];
};

export const menu: MenuItem[] = [
  {
    id: 1,
    label: 'Панель',
    link: '/admin/dashboard',
  },
  {
    id: 2,
    label: 'Заказы',
    link: '/admin/orders',
  },
  {
    id: 3,
    label: 'Меню',
    link: '/admin/menu/ingredients',
    children: [
      { id: 31, label: 'Ингредиенты', link: '/admin/menu/ingredients' },
      { id: 32, label: 'Категории', link: '/admin/menu/categories' },
      { id: 33, label: 'Блюда', link: '/admin/menu/products' },
    ],
  },
  {
    id: 4,
    label: 'Правила и добавки',
    link: '/admin/rules',
  },
];
