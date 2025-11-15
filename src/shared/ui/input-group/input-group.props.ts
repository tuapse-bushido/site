import { InputProps, LabelProps, DivProps } from '@/src/shared/types';

export type InputGroupProps = InputProps & {
  id: string;
  labelTitle?: string;
  variant?: 'front' | 'back';

  classNames?: {
    rootClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
  };

  rootProps?: DivProps;
  labelProps?: LabelProps;
};
