'use client';

import dynamic from 'next/dynamic';
import Paper from '@mui/material/Paper';
import { ComponentType, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { DataGridProps, GridColDef } from '@mui/x-data-grid';

const loadDataGrid = (): Promise<ComponentType<DataGridProps>> =>
  import('@mui/x-data-grid').then((mod): ComponentType<DataGridProps> => mod.DataGrid);

const DataGrid = dynamic<DataGridProps>(loadDataGrid, {
  ssr: false,
  loading: (): JSX.Element => <Paper style={{ height: '100%', width: '100%' }}>Загрузка таблицы...</Paper>,
});

export type Props<T> = {
  columns: GridColDef[];
  data: T[];
  getRowHrefAction: (id: string | number) => string;
};

export function TableComponent<T>({ columns, data, getRowHrefAction }: Props<T>): JSX.Element {
  const router = useRouter();

  return (
    <Paper sx={{ height: '100%', overflow: 'hidden' }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        columns={columns}
        rows={data}
        getRowId={(row): number => row.id}
        onRowClick={(params): void => router.push(getRowHrefAction(params.id))}
        autosizeOnMount
        autosizeOptions={{
          includeHeaders: true,
          includeOutliers: true,
        }}
        hideFooter
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress',
          },
        }}
      />
    </Paper>
  );
}
