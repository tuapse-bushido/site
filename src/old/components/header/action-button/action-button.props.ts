import { FC, SVGProps } from 'react';

type Action = 'cart' | 'search' | 'favorites';

export type ActionIcons = Record<Action, FC<SVGProps<SVGElement>>>;

export type ActionButtonProps = {
  action: Action;
  className?: string;
};
