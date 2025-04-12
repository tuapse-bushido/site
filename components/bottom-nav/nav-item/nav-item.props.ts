import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { BottomNavItem } from '@/types';

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type NavItemProps = DivProps & {
  navItem: BottomNavItem;
};
