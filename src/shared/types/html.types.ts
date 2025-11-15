import type { ComponentProps } from 'react';

export type DivProps = ComponentProps<'div'> & {
  [key: `data-${string}`]: unknown;
};
export type InputProps = ComponentProps<'input'>;
export type LabelProps = ComponentProps<'label'>;
