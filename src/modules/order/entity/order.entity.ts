import { z } from 'zod';

export type Order = {
  id: number;
  order_number: string;

  user_id: number | null;
  customer_name: string;
  customer_phone: string;

  address_city: string | null;
  address_street: string | null;
  address_house: string | null;
  address_apartment: string | null;
  address_floor: string | null;
  address_entrance: string | null;
  address_intercom: string | null;

  total_price: number;

  order_type: string;
  payment_status: string;
  payment_type: string;

  status: string;

  created_at: Date;
};

export type OrderInsert = Omit<Order, 'id' | 'created_at'>;

export const orderSchema = z.object({
  id: z.number(),
  order_number: z.string(),

  user_id: z.number().nullable(),
  customer_name: z.string(),
  customer_phone: z.string(),

  address_city: z.string().nullable(),
  address_street: z.string().nullable(),
  address_house: z.string().nullable(),
  address_apartment: z.string().nullable(),
  address_floor: z.string().nullable(),
  address_entrance: z.string().nullable(),
  address_intercom: z.string().nullable(),

  total_price: z.coerce.number(),

  order_type: z.string(),
  payment_status: z.string(),
  payment_type: z.string(),

  status: z.string(),

  created_at: z.coerce.date(),
});
