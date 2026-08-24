'use client';

import { JSX } from 'react';
import { OrderTable } from 'modules/admin/orders/model';
import { TABLE_CONFIG } from 'modules/admin/shared/ui/entity-page-template/model/table.config';
import { TableComponent } from 'modules/admin/shared/ui/entity-page-template/ui/table';

type Props = {
  data: OrderTable[];
};

export const OrdersTable = ({ data }: Props): JSX.Element => {
  const config = TABLE_CONFIG.orders;

  return <TableComponent columns={config.columns} data={data} getRowHrefAction={config.href.edit} />;
};
