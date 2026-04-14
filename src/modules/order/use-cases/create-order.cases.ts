import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { Order } from 'modules/order/entity/order.entity';
import { ErrorCode } from 'shared/types/error-codes.types';
import { actionError } from 'modules/admin/shared/utils/action.utils';
import { getTotalPriceInCart } from 'modules/client/cart/model/cart-total-price';
import { getNextOrderNumber, insertOrder, insertOrderItems } from '../repository/order.repository';
import { CreateOrderPayload, createOrderToInsertMapper, formatOrderNumber, orderItemsToInsertMapper } from '../model';

export const createOrder = async (payload: CreateOrderPayload): Promise<ActionResult<Order>> => {
  const client = await pool.connect();

  const { checkout, cart } = payload;

  try {
    await client.query('BEGIN');

    const getOrderNumber = await getNextOrderNumber(client);
    if (!getOrderNumber.ok) {
      await client.query('ROLLBACK');
      return getOrderNumber;
    }

    const orderNumber = formatOrderNumber(getOrderNumber.data.counter);

    const totalPrice = getTotalPriceInCart(cart);

    const orderMap = createOrderToInsertMapper(checkout, orderNumber, totalPrice);
    const order = await insertOrder(client, orderMap);
    if (!order.ok) {
      await client.query('ROLLBACK');
      return order;
    }
    const orderId = order.data.id;

    const orderItems = orderItemsToInsertMapper(orderId, cart);
    const insertItems = await insertOrderItems(client, orderItems);
    if (!insertItems.ok) {
      await client.query('ROLLBACK');
      return insertItems;
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    return actionError(ErrorCode.UNKNOWN, { details: error });
  } finally {
    client.release();
  }
};
