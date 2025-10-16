'use server';
import { CartState } from '@/types';
import { CheckoutState } from '@/libs/redux/slices/checkout-slice';
import { pool } from '@/libs/db/db';
import { ActionResult, actionResult, ErrorCode, errorResult } from '@/utils';
import { orderDailyCounterSchema } from '@/types/db/tables/order-daily-counter';
import { Order, orderSchema } from '@/types/db/tables/order';
import { ColumnWiseOrderItems, orderItemArraySchema } from '@/types/db/tables/order-item';
import { FullOrder, fullOrderArraySchema, fullOrderSchema } from '@/types/db/composite/full-order';

const formatOrderNumber = (counter: number): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const count = String(counter).padStart(3, '0');

  return `${dd}${mm}${yy}-${count}`;
};

export const insertOrder = async (orderData: CheckoutState, orderItems: CartState): Promise<ActionResult<Order>> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: counterRows } = await client.query(`
      INSERT INTO order_daily_counter (order_date, counter)
      VALUES (CURRENT_DATE, 1)
      ON CONFLICT (order_date) DO UPDATE
        SET counter = order_daily_counter.counter + 1
      RETURNING *;
    `);

    const counter = orderDailyCounterSchema.safeParse(counterRows[0]);

    if (!counter.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    const orderNumber = formatOrderNumber(counter.data.counter);

    const { items, addons } = orderItems;

    const itemsPrice = Object.values(items)
      .map((item): number => item.price * item.quantity_in_cart)
      .reduce((acc, cur): number => acc + cur, 0);
    const addonsPrice = Object.values(addons)
      .map((addon): number => {
        if (addon.quantity_in_cart > addon.max_free_quantity) {
          return addon.addon_product.price * (addon.quantity_in_cart - addon.max_free_quantity);
        } else {
          return 0;
        }
      })
      .reduce((acc, cur): number => acc + cur, 0);
    const totalPrice = itemsPrice + addonsPrice;

    const { name, phone } = orderData.user;
    const { payment_type, order_type } = orderData.order;
    const city = orderData.user.address ? orderData.user.address.city : null;
    const street = orderData.user.address ? orderData.user.address.street : null;
    const house = orderData.user.address ? orderData.user.address.house : null;
    const apartment = orderData.user.address ? orderData.user.address.apartment : null;
    const floor = orderData.user.address ? orderData.user.address.floor : null;
    const entrance = orderData.user.address ? orderData.user.address.entrance : null;
    const intercom = orderData.user.address ? orderData.user.address.intercom : null;

    const { rows: orderRows } = await client.query(
      `
        INSERT INTO orders (order_number, customer_name, customer_phone, user_id, address_city, address_street,
                            address_house, address_apartment, address_floor, address_entrance, address_intercom,
                            total_price, order_type, payment_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `,
      [
        orderNumber,
        name,
        phone,
        null,
        city,
        street,
        house,
        apartment,
        floor,
        entrance,
        intercom,
        totalPrice,
        order_type,
        payment_type,
      ],
    );

    const order = orderSchema.safeParse(orderRows[0]);

    if (!order.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    const order_id = order.data.id;

    const payload: ColumnWiseOrderItems = {
      order_id: [],
      product_id: [],
      quantity_total: [],
      quantity_free: [],
      unit_price: [],
      total_price: [],
    };

    Object.values(items).forEach((item): void => {
      const { id, quantity_in_cart, price } = item;

      payload.order_id.push(order_id);
      payload.product_id.push(id);
      payload.quantity_total.push(quantity_in_cart);
      payload.quantity_free.push(0);
      payload.unit_price.push(price);
      payload.total_price.push(quantity_in_cart * price);
    });

    Object.values(addons).forEach((addon): void => {
      const {
        addon_product: { id, price },
        max_free_quantity,
        quantity_in_cart,
      } = addon;

      const free_quantity = quantity_in_cart >= max_free_quantity ? max_free_quantity : quantity_in_cart;
      const total_price = quantity_in_cart > max_free_quantity ? (quantity_in_cart - max_free_quantity) * price : 0;

      payload.order_id.push(order_id);
      payload.product_id.push(id);
      payload.quantity_total.push(quantity_in_cart);
      payload.quantity_free.push(free_quantity);
      payload.unit_price.push(price);
      payload.total_price.push(total_price);
    });

    const { rows: orderItemsRows } = await client.query(
      `
        INSERT INTO order_item (order_id, product_id, quantity_total, quantity_free, unit_price, total_price)
        SELECT *
        FROM unnest(
          $1::int[], $2::int[], $3::int[], $4::int[], $5::numeric[], $6::numeric[]
             )
        RETURNING *;
      `,
      [
        payload.order_id,
        payload.product_id,
        payload.quantity_total,
        payload.quantity_free,
        payload.unit_price,
        payload.total_price,
      ],
    );

    const orderItemsData = orderItemArraySchema.safeParse(orderItemsRows);

    if (!orderItemsData.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    await client.query('COMMIT');
    return actionResult<Order>(order.data);
  } catch (error) {
    await client.query('ROLLBACK');
    return errorResult(ErrorCode.DB_ERROR);
  } finally {
    client.release();
  }
};

export const getFullOrdersByDate = async (date: string): Promise<ActionResult<FullOrder[]>> => {
  try {
    const query = `
      SELECT o.*,
             COALESCE(
               (SELECT json_agg(json_build_object(
                 'title', p.title,
                 'quantity', oi.quantity_total
                                ))
                FROM order_item oi
                       JOIN product p ON p.id = oi.product_id
                WHERE oi.order_id = o.id),
               '[]'
             ) AS products

      FROM orders o
      WHERE o.created_at::date = $1
      ORDER BY o.created_at DESC`;

    const response = await pool.query(query, [date]);
    const result = fullOrderArraySchema.safeParse(response.rows);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult(result.data);
  } catch (error) {
    console.log(error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

export const getOrderById = async (order_id: string): Promise<ActionResult<FullOrder>> => {
  try {
    const query = `
      SELECT o.*,
             COALESCE(
               (SELECT json_agg(json_build_object(
                 'title', p.title,
                 'quantity', oi.quantity_total
                                ))
                FROM order_item oi
                       JOIN product p ON p.id = oi.product_id
                WHERE oi.order_id = o.id),
               '[]'
             ) AS products
      FROM orders o
      WHERE o.id = $1
    `;

    const response = await pool.query(query, [order_id]);
    const result = fullOrderSchema.safeParse(response.rows[0]);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult(result.data);
  } catch (error) {
    console.log(error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};
