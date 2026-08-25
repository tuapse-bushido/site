import { dbQuery } from 'shared/utils/db.utils';
import { ActionResult } from 'shared/types/action.types';
import { arrayFullOrderSchema, FullOrder, fullOrderSchema, Order, orderSchema, OrderStatus } from '../entities';

export const ordersRepo = {
  async getFullOrdersByRange(from: string | Date, to: string | Date): Promise<ActionResult<FullOrder[]>> {
    const query = `
        SELECT
            o.*,
            COALESCE(items.products, '[]') AS products
        FROM orders o
                 LEFT JOIN LATERAL (
            SELECT json_agg(
                           json_build_object(
                                   'id', p.id,
                                   'title', p.title,
                                   'quantity', oi.quantity_total,
                                   'price', oi.unit_price,
                                   'total_price', oi.total_price,
                                   'image_link', p.image_link
                           )
                   ) AS products
            FROM order_item oi
                     JOIN product p ON p.id = oi.product_id
            WHERE oi.order_id = o.id
            ) items ON true
        WHERE o.created_at >= $1
          AND o.created_at <= $2
        ORDER BY o.created_at DESC
    `;

    return dbQuery(query, [from, to], arrayFullOrderSchema, 'multiple');
  },

  async getOrderById(id: number): Promise<ActionResult<FullOrder>> {
    const query = `
        SELECT o.*,
               COALESCE(items.products, '[]') AS products
        FROM orders o
                 LEFT JOIN LATERAL (
            SELECT json_agg(
                           json_build_object(
                                   'id', p.id,
                                   'title', p.title,
                                   'quantity', oi.quantity_total,
                                   'price', oi.unit_price,
                                   'total_price', oi.total_price,
                                   'image_link', p.image_link
                           )
                   ) AS products
            FROM order_item oi
                     JOIN product p ON p.id = oi.product_id
            WHERE oi.order_id = o.id
            ) items ON true
        WHERE o.id = $1
        LIMIT 1
    `;

    return dbQuery(query, [id], fullOrderSchema, 'single');
  },

  updateStatus: async (id: number, status: OrderStatus): Promise<ActionResult<Order>> => {
    const query = `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;
    return dbQuery(query, [status, id], orderSchema, 'single');
  },
};
