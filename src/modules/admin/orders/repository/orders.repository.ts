import { dbQuery } from 'shared/utils/db.utils';
import { ActionResult } from 'shared/types/action.types';
import { arrayFullOrderSchema, FullOrder, fullOrderSchema } from '../entities';

export const getFullOrdersByRange = async (
  from: string | Date,
  to: string | Date,
): Promise<ActionResult<FullOrder[]>> => {
  const query = `
      SELECT o.*,

             COALESCE(
                     (SELECT json_agg(
                                     json_build_object(
                                             'id', p.id,
                                             'title', p.title,
                                             'quantity', oi.quantity_total,
                                             'price', oi.unit_price,
                                             'total_price', oi.total_price
                                     )
                             )
                      FROM order_item oi
                               JOIN product p ON p.id = oi.product_id
                      WHERE oi.order_id = o.id),
                     '[]'
             ) AS products

      FROM orders o
      WHERE o.created_at >= $1
        AND o.created_at <= $2
      ORDER BY o.created_at DESC
  `;

  return dbQuery(query, [from, to], arrayFullOrderSchema, 'multiple');
};

export const getOrderById = async (id: number): Promise<ActionResult<FullOrder>> => {
  const query = `
      SELECT o.*,
             COALESCE(
                     (SELECT json_agg(
                                     json_build_object(
                                             'id', p.id,
                                             'title', p.title,
                                             'quantity', oi.quantity_total,
                                             'price', oi.unit_price,
                                             'total_price', oi.total_price
                                     )
                             )
                      FROM order_item oi
                               JOIN product p ON p.id = oi.product_id
                      WHERE oi.order_id = o.id),
                     '[]'
             ) AS products
      FROM orders o
      WHERE o.id = $1
      LIMIT 1
  `;

  return dbQuery(query, [id], fullOrderSchema, 'single');
};
