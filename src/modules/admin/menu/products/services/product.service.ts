import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { productRepo } from 'modules/admin/menu/products/repository';
import { Product, UpsertProduct } from 'modules/admin/menu/products/entities';

export const productService = {
  async syncProduct(
    product: UpsertProduct,
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Product>> {
    const { id, ...all } = product;

    if (mode === 'update') {
      if (id === undefined) {
        throw new Error('ID is required for update mode');
      }
      return await productRepo.updateProduct({ id, ...all }, executor);
    }
    return await productRepo.insertProduct(product, executor);
  },

  async syncDeleteProduct(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    return await productRepo.deleteProduct(id, executor);
  },
};
