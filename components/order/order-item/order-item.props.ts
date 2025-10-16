import { DivProps } from '@/types';
import { FullOrder } from '@/types/db/composite/full-order';

export type OrderItemProps = DivProps & {
  index: number;
  order: FullOrder;
};
