import { OrderTable } from 'modules/admin/orders/model';
import { dayjs } from 'modules/admin/shared/libs/dayjs';
import { FullOrder } from 'modules/admin/orders/entities';

const getFullAddress = (order: FullOrder): string => {
  const city = order.address_city ? `г. ${order.address_city}` : '';
  const street = order.address_street ? `ул. ${order.address_street}` : '';
  const house = order.address_house ? `д. ${order.address_house}` : '';
  const apartment = order.address_apartment ? `кв. ${order.address_apartment}` : '';

  return `${city} ${street} ${house} ${apartment}`;
};

export const formatOrderData = (order: FullOrder): OrderTable => {
  return {
    ...order,

    formattedDate: dayjs(order.created_at).format('D MMMM YYYY, HH:mm'),

    fullAddress: order.order_type === 'delivery' ? getFullAddress(order).trim() || 'Адрес не указан' : '🥡 Самовывоз',

    orderType: order.order_type === 'delivery' ? '🚀 Доставка' : '🥡 Самовывоз',

    paymentMethod: order.payment_type === 'courier' ? '💳 Оплата курьеру' : '🥡 Оплата при самовывозе',
  };
};

export const mapOrdersToTable = (orders: FullOrder[]): OrderTable[] => {
  return orders.map(formatOrderData);
};
