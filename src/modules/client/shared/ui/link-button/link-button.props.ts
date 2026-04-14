import { ReactNode } from 'react';
import { LinkProps } from 'next/link';

export type LinkButtonProps = LinkProps & {
  href: string;
  children: ReactNode;
  className?: string;
};
