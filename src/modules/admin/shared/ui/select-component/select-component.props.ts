export type Option = {
  readonly value: string;
  readonly label: string;
};

type BaseProps = {
  label: string;
  name: string;
  options: readonly Option[];
  error?: boolean;
  helperText?: string | undefined;
};

type SingleProps = BaseProps & {
  multiple?: false;
  defaultSelect: string;
};

type MultipleProps = BaseProps & {
  multiple: true;
  defaultSelect: string[];
};

export type SelectComponentProps = SingleProps | MultipleProps;
