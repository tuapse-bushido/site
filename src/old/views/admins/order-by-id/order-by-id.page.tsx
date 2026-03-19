import { JSX } from 'react';
import { getOrderById } from '@/libs/db/orders/orders.query';
import { formatOrderInfo } from '@/utils';
import Form from 'next/form';

export const OrderByIdPage = async ({
  params,
}: {
  params: Promise<{ order_id: string }>;
}): Promise<JSX.Element | null> => {
  const { order_id } = await params;
  const orderResponse = await getOrderById(order_id);

  if (!orderResponse.success) return null;

  const { data: order } = orderResponse;

  const orderInfo = formatOrderInfo(order);

  return (
    <div>
      <h1>
        Заказ №{order.order_number} от {orderInfo.date} {orderInfo.time}
      </h1>

      <Form action={'#'}>
        <section>
          <h2>Информация о заказе</h2>
          <div>
            <span>Дата заказа:</span>
            <span>
              {orderInfo.date} {orderInfo.time}
            </span>
          </div>
          <div>
            <span>Статус заказа:</span>
            <span>{orderInfo.status}</span>
          </div>
          <div>
            <span>Тип заказа:</span>
            <span>{orderInfo.orderType}</span>
          </div>
          <div>
            <span>Метод оплаты:</span>
            <span>{orderInfo.paymentType}</span>
          </div>
          <div>
            <span>Статус оплаты:</span>
            <span>{orderInfo.paymentStatus}</span>
          </div>
        </section>
        <section>
          <h2>Состав заказа</h2>

          {order.products.map(
            (product, index): JSX.Element => (
              <div key={`${product.title}-${index}`}>
                <span>{product.title}</span>
                <span>{product.quantity}</span>
              </div>
            ),
          )}
        </section>
        <section>
          <h2>Информация о клиенте</h2>

          <div>
            <span>Имя:</span>
            <span>{order.customer_name}</span>
          </div>
          <div>
            <span>Телефон:</span>
            <span>{order.customer_phone}</span>
          </div>
          <div>
            <span>Адрес доставки:</span>
            <span>{orderInfo.address}</span>
          </div>
        </section>
      </Form>
    </div>
  );
};
