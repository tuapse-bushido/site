import { FullOrder } from 'modules/admin/orders/entities';

export type OrderTable = FullOrder & {
  formattedDate: string;
  fullAddress: string;
  orderType: string;
  paymentMethod: string;
};
