import { CartIcon, HomeIcon, MenuIcon, ProfileIcon, PromoIcon } from './icons';

export const BOTTOM_NAV_CONFIG = [
  {
    label: 'Главная',
    href: '/',
    icon: HomeIcon,
  },
  // {
  //   label: 'Меню',
  //   href: '/menu',
  //   icon: MenuIcon,
  // },
  // {
  //   label: 'Профиль',
  //   href: '/profile',
  //   icon: ProfileIcon,
  // },
  // {
  //   label: 'Акции',
  //   href: '/promo',
  //   icon: PromoIcon,
  // },
  {
    label: 'Корзина',
    href: '/cart',
    icon: CartIcon,
  },
] as const;
