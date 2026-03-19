import { InputProps, LabelProps } from '@/types';
import React from 'react';

export type InputGroupProps = InputProps & {
  label?: React.ReactNode;
  labelProps?: LabelProps;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
};
