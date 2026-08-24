'use client';

import { JSX } from 'react';
import { TableComponent } from './table';
import { EntityToolbar } from './entity-toolbar';
import { TABLE_CONFIG } from '../model/table.config';
import { PageContainer } from '../../page-container';
import { useTableSearch } from '../lib/use-table-search';

type Props<T> = {
  type: keyof typeof TABLE_CONFIG;
  data: T[];
};

export const EntityPage = <T,>({ type, data }: Props<T>): JSX.Element => {
  const config = TABLE_CONFIG[type];
  const { filteredData, search, setSearch } = useTableSearch<T>(data, config.searchKey as keyof T);

  return (
    <PageContainer
      title={config.label.plural}
      actions={
        <EntityToolbar
          search={search}
          onSearchChange={setSearch}
          {...(config.href.create !== undefined ? { addHref: config.href.create } : {})}
          addTitle={config.label.singular}
        />
      }
    >
      <TableComponent columns={config.columns} data={filteredData} getRowHrefAction={config.href.edit} />
    </PageContainer>
  );
};
