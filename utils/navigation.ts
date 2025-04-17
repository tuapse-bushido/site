import { BottomNavItem, MenuPageItem } from '@/types';

/**
 * Configuration array for bottom navigation items.
 *
 * Each item defines:
 * - iconId: maps to an icon in IconMap
 * - label: visible text below the icon
 * - href: target route
 *
 * Used by the <BottomNav /> component to render the navigation UI.
 *
 * ---
 * Массив конфигурации пунктов нижней навигации.
 * Используется в компоненте `<BottomNav />` для отображения панели.
 * Каждый пункт содержит:
 * - iconId — ключ иконки
 * - label — подпись
 * - href — маршрут
 */
export const bottomNav: BottomNavItem[] = [
  { iconId: 'home', label: 'Главная', href: '/' },
  { iconId: 'menu', label: 'Меню', href: '/menu' },
  { iconId: 'profile', label: 'Профиль', href: '/profile' },
  { iconId: 'promo', label: 'Акции', href: '/promo' },
  { iconId: 'cart', label: 'Корзина', href: '/cart' },
];

export const menuPage: MenuPageItem[] = [
  { title: 'Новинки', icon: 'new', href: '/menu/new' },
  { title: 'Горячее', icon: 'hot', href: '/menu/hot' },
  { title: 'Онигири', icon: 'onigiri', href: '/menu/onigiri' },
  { title: 'Пицца', icon: 'pizza', href: '/menu/pizza' },
  { title: 'Роллы', icon: 'rolls', href: '/menu/rolls' },
  { title: 'Салаты', icon: 'salads', href: '/menu/salads' },
  { title: 'Сеты', icon: 'sets', href: '/menu/sets' },
  { title: 'Суши', icon: 'sushi', href: '/menu/sushi' },
  { title: 'Wok', icon: 'wok', href: '/menu/wok' },
];
