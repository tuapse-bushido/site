import { DivProps } from 'src/old/types';
import { FullOrder } from 'src/old/types/db/composite/full-order';

export type OrderItemProps = DivProps & {
  index: number;
  order: FullOrder;
};
