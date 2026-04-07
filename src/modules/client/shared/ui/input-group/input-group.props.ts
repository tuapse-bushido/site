import { type ComponentProps, ReactNode } from 'react';

export type InputProps = ComponentProps<'input'>;

export type InputGroupProps = InputProps & {
  id: string;
  labelTitle?: string | ReactNode;
  classNames?: {
    root?: string;
    label?: string;
  };
};
