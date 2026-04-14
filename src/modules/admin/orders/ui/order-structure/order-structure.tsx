import { OrderItem } from 'modules/admin/orders/entities';
import { JSX } from 'react';
import { StructureList } from 'modules/admin/orders/ui/order-structure/structure-list';
import { MuiDivider, MuiPaper, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';

type Props = {
  products: OrderItem[];
  totalPrice: number;
};

export const OrderStructure = ({ products, totalPrice }: Props): JSX.Element => {
  return (
    <MuiPaper sx={{ py: 3, borderRadius: 3 }}>
      <MuiStack gap={3}>
        <MuiTypography variant="h5" fontWeight={600} sx={{ px: 3 }}>
          Состав заказа
        </MuiTypography>

        <MuiDivider />

        <MuiStack sx={{ px: 3 }}>
          <StructureList products={products} />

          <MuiDivider sx={{ my: 2 }} />

          <MuiStack direction="row" justifyContent="space-between" alignItems="center">
            <MuiTypography variant="h5" fontWeight="700">
              Итого:
            </MuiTypography>
            <MuiTypography variant="h5" fontWeight="700">
              {totalPrice} ₽
            </MuiTypography>
          </MuiStack>
        </MuiStack>
      </MuiStack>
    </MuiPaper>
  );
};
