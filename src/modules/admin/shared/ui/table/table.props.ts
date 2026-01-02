import { GridColDef } from '@mui/x-data-grid';

export type TableComponentProps<T> = {
  columns: GridColDef[];
  data: T[];
  slug: string;
};
