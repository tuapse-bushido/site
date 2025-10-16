export type BaseRow = {
  id: number | string;
  title?: string;
  image_link?: string | null;
  is_visible?: boolean;
  is_active?: boolean;
  is_set?: boolean;
  [key: string]: unknown;
};

export type TBodyComponentProps<T extends BaseRow> = {
  data: T[];
  mapColumns: (keyof T)[];
  slug: string;
};
