import { JSX } from 'react';
import Link from 'next/link';
import styles from './link-button.module.scss';
import { LinkButtonProps } from '@/components/ui/link-button/link-button.props';
import clsx from 'clsx';

export const LinkButton = ({ href, label, className, type }: LinkButtonProps): JSX.Element => {
  return (
    <Link href={href} className={clsx(styles.link, type && styles[type], className)}>
      {label}
    </Link>
  );
};
