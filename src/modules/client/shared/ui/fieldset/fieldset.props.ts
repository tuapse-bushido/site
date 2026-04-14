import { FieldsetHTMLAttributes, ReactNode } from 'react';

export type Fieldset = FieldsetHTMLAttributes<HTMLFieldSetElement>;

export type FieldsetProps = Fieldset & {
  legendTitle: string;
  children: ReactNode;
};
