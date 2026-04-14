import clsx from 'clsx';
import { JSX } from 'react';
import Link from 'next/link';
import { LinkButtonProps } from './link-button.props';

export const LinkButton = ({ href, children, className, ...props }: LinkButtonProps): JSX.Element => {
  return (
    <Link href={href} className={clsx(className)} {...props}>
      {children}
    </Link>
  );
};
