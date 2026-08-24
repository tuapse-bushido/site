'use client';

import dynamic from 'next/dynamic';
import Paper from '@mui/material/Paper';
import { ComponentType, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { Theme, useMediaQuery } from '@mui/material';
import { DataGridProps, GridColDef } from '@mui/x-data-grid';

const loadDataGrid = (): Promise<ComponentType<DataGridProps>> =>
  import('@mui/x-data-grid').then((mod): ComponentType<DataGridProps> => mod.DataGrid);

const DataGrid = dynamic<DataGridProps>(loadDataGrid, {
  ssr: false,
  loading: (): JSX.Element => <Paper style={{ height: '100%', width: '100%' }}>Загрузка таблицы...</Paper>,
});

type ResponsiveGridColDef = GridColDef & {
  hideOnMobile?: boolean;
};

export type Props<T> = {
  columns: ResponsiveGridColDef[];
  data: T[];
  getRowHrefAction: (id: string | number) => string;
};

export function TableComponent<T>({ columns, data, getRowHrefAction }: Props<T>): JSX.Element {
  const router = useRouter();

  const isMobile = useMediaQuery((theme: Theme): string => theme.breakpoints.down('sm'));
  const visibleColumns = isMobile ? columns.filter((column): boolean => !column.hideOnMobile) : columns;

  return (
    <Paper
      sx={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <DataGrid
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        columns={visibleColumns}
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
