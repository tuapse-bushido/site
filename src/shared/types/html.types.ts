import type { ComponentProps } from 'react';
import { ImageProps as NextImageProps } from 'next/image';

export type DivProps = ComponentProps<'div'> & {
  [key: `data-${string}`]: unknown;
};
export type ImageProps = Omit<NextImageProps, 'src' | 'alt'>;
export type InputProps = ComponentProps<'input'>;
export type LabelProps = ComponentProps<'label'>;
