import { TitleColumns } from '@/utils/configs/table-columns';

export type THeadComponentProps<T> = {
  mapColumns: (keyof T)[];
  titleColumns: TitleColumns<T>;
};
