export type TableComponentProps<T> = {
  data: T[];
  mapColumns: (keyof T)[];
  titleColumns: Record<string, string>;
  slug: string;
};
