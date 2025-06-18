import { z } from 'zod';

/**
 * Zod schema for a set item (a product inside a set).
 *
 * ---
 *
 * Схема Zod для элемента сета (товара, входящего в состав сета).
 *
 * @property {number} id - Unique ID of the set item / Уникальный ID записи
 * @property {number} set_product_id - ID of the set product / ID сета
 * @property {number} product_id - ID of the included product / ID вложенного товара
 * @property {number} quantity - How many of this product is in the set / Кол-во единиц товара в составе
 *
 * @example
 * const item: SetItemType = {
 *   id: 1,
 *   set_product_id: 101,
 *   product_id: 202,
 *   quantity: 2,
 * };
 */
export const setItemSchema = z.object({
  id: z.number(),
  set_product_id: z.number(),
  product_id: z.number(),
  quantity: z.number(),
});

export const setItemArraySchema = z.array(setItemSchema);
export type SetItemType = z.infer<typeof setItemSchema>;
