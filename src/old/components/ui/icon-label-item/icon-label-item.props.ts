import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

type LinkProps = DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export type IconType = React.FC<React.SVGProps<SVGSVGElement>> | string;

export type IconLabelItemProps = LinkProps & {
  icon: IconType;
  label: string;
  href: string;
  rootClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
};
