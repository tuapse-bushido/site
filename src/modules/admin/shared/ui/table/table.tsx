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
  loading: (): JSX.Element => <div style={{ height: 400, width: '100%' }}>Загрузка таблицы...</div>,
});

export type Props<T> = {
  columns: GridColDef[];
  data: T[];
  slug: string;
};

const styles = {
  paper: {
    height: '100%',
    overflow: 'hidden',
  },
  dataGrid: {
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
    },
  },
};

export function TableComponent<T>({ columns, data, slug }: Props<T>): JSX.Element {
  const router = useRouter();

  return (
    <Paper sx={styles.paper}>
      <DataGrid
        sx={styles.dataGrid}
        columns={columns}
        rows={data}
        getRowId={(row): number => row.id}
        onRowClick={(params): void => router.push(`/admin/${slug}/${params.row.id}`)}
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
