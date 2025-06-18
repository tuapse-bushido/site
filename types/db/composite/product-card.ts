import { Product, productSchema } from '@/types';
import { AddonRule } from '@/types/db/tables/addon-rule';
import { z } from 'zod';

/**
 * Extended product type used for the product card view.
 *
 * Combines base product fields with related data:
 * - ingredients: array of ingredient titles
 * - category_ids: category IDs the product belongs to
 * - discount_percent: resolved discount for the product
 * - addons: list of applicable addon rules with their products
 * - set_items: set composition with individual ingredients
 *
 * ---
 * Расширенный тип товара, используемый для карточки товара.
 *
 * Содержит базовые поля продукта и связанные данные:
 * - ingredients: массив названий ингредиентов
 * - category_ids: массив ID категорий, к которым относится продукт
 * - discount_percent: рассчитанный процент скидки
 * - addons: список правил добавок с соответствующими продуктами
 * - set_items: состав сета с ингредиентами каждого элемента
 */
export type ProductCard = Product & {
  ingredients: string[];
  category_ids: number[];
  discount_percent: number;
  addons: AddonRuleWithProduct[];
  set_items: SetItemWithIngredients[];
};

/**
 * Addon rule with product list, used in product card context.
 *
 * ---
 * Правило добавки с продуктами, применимое к карточке товара.
 */
type AddonRuleWithProduct = Omit<AddonRule, 'id' | 'addon_group_id' | 'is_active' | 'title'> & {
  addon_rule_id: number;
  addon_products: ProductCard[];
};

/**
 * Item included in a set product, with its ingredients.
 *
 * ---
 * Продукт в составе сета, включая ингредиенты.
 */
type SetItemWithIngredients = {
  ingredients: string[];
};

/**
 * Basic ID and title schema used for referencing related entities.
 *
 * ---
 * Базовая схема сущностей, содержащих только ID и название.
 */
const idTitleSchema = z.object({
  id: z.number(),
  title: z.string(),
});

/**
 * Extended product schema with related details.
 *
 * ---
 * Расширенная схема товара, включающая связанные сущности:
 * - категории
 * - ингредиенты
 * - состав сета
 */
export const productWithDetailsSchema = productSchema.extend({
  categories: z.array(idTitleSchema),
  ingredients: z.array(idTitleSchema),
  set_items: z.array(idTitleSchema),
});

/**
 * Inferred TypeScript type of product with details.
 *
 * ---
 * Тип товара с категориями, ингредиентами и составом сета.
 */
export type ProductWithDetails = z.infer<typeof productWithDetailsSchema>;
