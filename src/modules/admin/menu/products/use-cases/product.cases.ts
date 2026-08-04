import { logger } from 'shared/utils/logger';

import { ActionResult } from 'shared/types/action.types';
import { ErrorCode } from 'shared/types/error-codes.types';
import { actionError, actionSuccess } from 'modules/admin/shared/utils/action.utils';

import { productRepo } from 'modules/admin/menu/products/repository';
import { categoryRepo } from 'modules/admin/menu/categories/repository';
import { ingredientRepo } from 'modules/admin/menu/ingredients/repository';

import {
  Product,
  ProductCategoryRelation,
  ProductEditData,
  ProductIngredientRelation,
  ProductSetItemRelation,
  UpsertProduct,
} from 'modules/admin/menu/products/entities';
import { pool } from 'shared/configs/db';
import { productService } from 'modules/admin/menu/products/services/product.service';
import { productRelationsService } from 'modules/admin/menu/products/services';

export const productCases = {
  async getProductEditData(id?: number): Promise<ActionResult<ProductEditData>> {
    try {
      const [ingredientsResult, categoriesResult, productsResult, productResult] = await Promise.all([
        ingredientRepo.getAllIngredients(),
        categoryRepo.getAllCategories(),
        productRepo.getAllProducts(),
        id === undefined ? Promise.resolve(null) : productRepo.getProductWithDetails(id),
      ]);

      // Основной запрошенный ресурс
      if (productResult && !productResult.ok) {
        logger.warn({
          msg: 'PRODUCT_EDIT_PRODUCT_LOAD_FAILED',
          productId: id,
          code: productResult.code,
          details: productResult.options.details,
        });

        return actionError(productResult.code === ErrorCode.NOT_FOUND ? ErrorCode.NOT_FOUND : ErrorCode.DB_ERROR);
      }

      // Вспомогательные данные формы рассматриваем как единый набор
      if (!ingredientsResult.ok || !categoriesResult.ok || !productsResult.ok) {
        logger.error({
          msg: 'PRODUCT_EDIT_OPTIONS_LOAD_FAILED',
          productId: id,
          errors: {
            ingredients: ingredientsResult.ok ? null : ingredientsResult.code,
            categories: categoriesResult.ok ? null : categoriesResult.code,
            products: productsResult.ok ? null : productsResult.code,
          },
        });

        return actionError(ErrorCode.DB_ERROR);
      }

      const baseData = {
        ingredients: ingredientsResult.data,
        categories: categoriesResult.data,
        products: productsResult.data,
      };

      // Создание продукта
      if (!productResult) {
        return actionSuccess(baseData);
      }

      // Редактирование продукта
      const product = productResult.data;

      return actionSuccess({
        ...baseData,
        product,
        products: baseData.products.filter(({ id }): boolean => id !== product.id),
      });
    } catch (error) {
      logger.error({
        msg: 'PRODUCT_EDIT_DATA_UNEXPECTED_FAILURE',
        productId: id,
        error: error instanceof Error ? error.message : error,
      });

      return actionError(ErrorCode.UNKNOWN);
    }
  },

  async upsertProductCase(
    product: UpsertProduct,
    ingredients: number[] | null,
    categories: number[] | null,
    setItems: number[] | null,
    mode: 'insert' | 'update',
  ): Promise<ActionResult<Product>> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const productResult = await productService.syncProduct(product, mode, client);

      if (!productResult.ok) {
        await client.query('ROLLBACK');
        return productResult;
      }

      const productId = productResult.data.id;

      const relationOperations = [
        {
          field: 'ingredients',
          ids: ingredients,
          sync: (ids: number[]): Promise<ActionResult<ProductIngredientRelation[]>> =>
            productRelationsService.ingredients.syncIngredientsRelation(productId, ids, mode, client),
        },
        {
          field: 'categories',
          ids: categories,
          sync: (ids: number[]): Promise<ActionResult<ProductCategoryRelation[]>> =>
            productRelationsService.categories.syncCategoriesRelation(productId, ids, mode, client),
        },
        {
          field: 'set_items',
          ids: setItems,
          sync: (ids: number[]): Promise<ActionResult<ProductSetItemRelation[]>> =>
            productRelationsService.setItems.syncSetItemsRelation(productId, ids, mode, client),
        },
      ] as const;

      for (const operation of relationOperations) {
        if (mode === 'insert' && operation.ids === null) {
          continue;
        }

        const result = await operation.sync(operation.ids ?? []);

        if (!result.ok) {
          await client.query('ROLLBACK');

          return actionError(result.code, {
            details: {
              field: operation.field,
              cause: result.options.details,
            },
          });
        }
      }

      await client.query('COMMIT');

      return productResult;
    } catch (error) {
      await client.query('ROLLBACK');

      logger.error({
        msg: 'UPSERT_PRODUCT_TRANSACTION_FAILED',
        data: { product, ingredients, categories, setItems },
        mode,
        error: error instanceof Error ? error.message : error,
      });

      return actionError(ErrorCode.UNKNOWN);
    } finally {
      client.release();
    }
  },
};
