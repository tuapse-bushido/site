import React, { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { IconLabelItemProps } from '@/components/ui/icon-label-item/icon-label-item.props';

export const IconLabelItem = ({
  href,
  icon,
  label,
  rootClassName,
  iconClassName,
  labelClassName,
}: IconLabelItemProps): JSX.Element => {
  const isImage = typeof icon === 'string';
  const Icon = icon as React.FC<React.SVGProps<SVGSVGElement>>;

  return (
    <Link
      className={clsx(rootClassName)}
      href={href}
      aria-label={label}
      // aria-current={isActive ? 'page' : undefined}
    >
      <span className={clsx(iconClassName)}>
        {isImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGES_CATEGORIES}${icon as string}`}
            alt=""
            width={28}
            height={28}
            aria-hidden="true"
          />
        ) : (
          Icon && <Icon aria-hidden="true" focusable="false" />
        )}
      </span>

      <span className={clsx(labelClassName)}>{label}</span>
    </Link>
  );
};
