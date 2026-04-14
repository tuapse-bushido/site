import { OrderInsert } from '../entity/order.entity';
import { CheckoutFormType } from 'modules/client/checkout/features/checkout-form/model';

export const createOrderToInsertMapper = (
  checkout: CheckoutFormType,
  orderNumber: string,
  totalPrice: number,
): OrderInsert => {
  const base = {
    order_number: orderNumber,

    customer_name: checkout.name,
    customer_phone: checkout.phone,

    user_id: null,

    total_price: totalPrice,

    order_type: checkout.order_type,
    payment_type: checkout.payment_type,
    payment_status: 'not_paid',

    status: 'new',
  };

  if (checkout.order_type === 'delivery') {
    return {
      ...base,

      address_city: checkout.city,
      address_street: checkout.street,
      address_house: checkout.house,

      address_apartment: checkout.apartment ?? null,
      address_floor: checkout.floor ?? null,
      address_entrance: checkout.entrance ?? null,
      address_intercom: checkout.intercom ?? null,
    };
  }

  return {
    ...base,

    address_city: null,
    address_street: null,
    address_house: null,

    address_apartment: null,
    address_floor: null,
    address_entrance: null,
    address_intercom: null,
  };
};
