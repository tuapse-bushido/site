import { JSX } from 'react';
import { ordersRepo } from 'modules/admin/orders/repository';
import { OrderStructure } from 'modules/admin/orders/ui/order-structure';
import { OrderClient } from 'modules/admin/orders/ui/order-client/order-client';
import { MuiDivider, MuiGrid, MuiStack } from 'modules/admin/shared/ui/mui';
import { DeliveryDetails } from 'modules/admin/orders/ui/delivery-details';
import { formatOrderData } from 'modules/admin/orders/utils';
import { OrderHeader } from 'modules/admin/orders/ui/order-header';
import { OrderDetailsAction } from 'modules/admin/orders/features/order-details-action';

export const OrderDetailScreen = async ({
  params,
}: {
  params: Promise<{
    order_id: string;
  }>;
}): Promise<JSX.Element | null> => {
  const { order_id } = await params;

  const order = await ordersRepo.getOrderById(Number(order_id));

  if (!order.ok) return null;

  const orderDetail = formatOrderData(order.data);

  return (
    <MuiStack direction={'column'} gap={4}>
      <MuiStack direction={'row'} justifyContent={'space-between'}>
        <OrderHeader
          orderNumber={orderDetail.order_number}
          date={orderDetail.formattedDate}
          status={orderDetail.status}
        />
        <OrderDetailsAction orderId={orderDetail.id} currentStatus={orderDetail.status} />
      </MuiStack>

      <MuiDivider />

      <MuiGrid container spacing={4}>
        <MuiGrid size={{ md: 4 }}>
          <OrderStructure products={orderDetail.products} totalPrice={orderDetail.total_price} />
        </MuiGrid>
        <MuiGrid size={{ md: 4 }}>
          <MuiStack gap={4}>
            <OrderClient customerName={orderDetail.customer_name} customerPhone={orderDetail.customer_phone} />
            <DeliveryDetails fullAddress={orderDetail.fullAddress} paymentType={orderDetail.paymentMethod} />
          </MuiStack>
        </MuiGrid>
      </MuiGrid>
    </MuiStack>
  );
};
