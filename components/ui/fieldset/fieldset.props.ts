import { FieldsetProps as FieldProps } from '@/types';
import { ReactNode } from 'react';

export type FieldsetProps = FieldProps & {
  legendTitle: string;
  children: ReactNode;
};
