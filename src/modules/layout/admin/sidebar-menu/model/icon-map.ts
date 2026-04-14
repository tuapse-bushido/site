import { DashboardIcon, MenuIcon, OrdersIcon, RulesIcon } from '../icons';

export const ADMIN_ICONS = {
  dashboard: DashboardIcon,
  orders: OrdersIcon,
  menu: MenuIcon,
  rules: RulesIcon,
} as const;

export type AdminIconName = keyof typeof ADMIN_ICONS;
