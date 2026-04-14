import { PoolClient } from 'pg';
import { dbQuery } from 'shared/utils/db.utils';
import { ActionResult } from 'shared/types/action.types';
import { Order, OrderInsert, orderSchema } from '../entity/order.entity';
import { OrderCounter, orderDailyCounterSchema } from '../model/order-counter.schema';
import { OrderItem, orderItemArraySchema, OrderItemPayload } from '../entity/order-item.entity';

export const getNextOrderNumber = async (client: PoolClient): Promise<ActionResult<OrderCounter>> => {
  const query = `
    INSERT INTO order_daily_counter (order_date, counter)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (order_date) DO UPDATE
      SET counter = order_daily_counter.counter + 1
    RETURNING *;
  `;

  return dbQuery(query, [], orderDailyCounterSchema, 'single', client);
};

export const insertOrder = async (client: PoolClient, order: OrderInsert): Promise<ActionResult<Order>> => {
  const query = `
    INSERT INTO orders (order_number, customer_name, customer_phone, user_id, address_city, address_street,
                        address_house, address_apartment, address_floor, address_entrance, address_intercom,
                        total_price, order_type, payment_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const params = [
    order.order_number,
    order.customer_name,
    order.customer_phone,
    null,
    order.address_city,
    order.address_street,
    order.address_house,
    order.address_apartment,
    order.address_floor,
    order.address_entrance,
    order.address_intercom,
    order.total_price,
    order.order_type,
    order.payment_type,
  ];

  return dbQuery(query, params, orderSchema, 'single', client);
};

export const insertOrderItems = async (
  client: PoolClient,
  payload: OrderItemPayload[],
): Promise<ActionResult<OrderItem[]>> => {
  const query = `
    INSERT INTO order_item (order_id,
                            product_id,
                            quantity_total,
                            quantity_free,
                            unit_price,
                            total_price)
    SELECT *
    FROM jsonb_to_recordset($1::jsonb) AS t(
                                            order_id int,
                                            product_id int,
                                            quantity_total int,
                                            quantity_free int,
                                            unit_price numeric,
                                            total_price numeric
      )
    RETURNING *;
  `;
  const params = [JSON.stringify(payload)];

  return dbQuery(query, params, orderItemArraySchema, 'multiple', client);
};

export const getOrderByOrderNumber = async (orderNumber: string): Promise<ActionResult<Order>> => {
  const query = `
    SELECT id,
           order_number,
           customer_name,
           customer_phone,
           user_id,
           address_city,
           address_street,
           address_house,
           address_apartment,
           address_floor,
           address_entrance,
           address_intercom,
           total_price,
           payment_status,
           order_type,
           payment_type,
           status,
           created_at
    from orders
    WHERE order_number = $1;
  `;

  return dbQuery(query, [orderNumber], orderSchema);
};
