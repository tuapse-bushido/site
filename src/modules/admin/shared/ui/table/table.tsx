'use client';

import React, { JSX } from 'react';
import { TableComponentProps } from './table.props';
import { BaseRow } from 'src/old/components/ui/table/tbody/tbody.props';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { DataGridProps } from '@mui/x-data-grid';

type DataGridModule = {
  DataGrid: React.ComponentType<DataGridProps>;
};

const loadDataGrid = async (): Promise<React.ComponentType<DataGridProps>> => {
  return import('@mui/x-data-grid').then((module: DataGridModule): React.ComponentType<DataGridProps> => {
    return module.DataGrid;
  });
};

const DataGrid = dynamic<DataGridProps>(loadDataGrid, { ssr: false });

export function TableComponent<T extends BaseRow>({ columns, data, slug }: TableComponentProps<T>): JSX.Element {
  const router = useRouter();
  return (
    <Paper sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        columns={columns}
        rows={data}
        getRowId={(row): number => row.id}
        sx={{ border: 0 }}
        onRowClick={(params): void => router.push(`/admin/${slug}/${params.row.id}`)}
        hideFooter
      />
    </Paper>
  );
}
