import { DashboardStats } from '../model/stats.types';
import { categoryRepo } from 'modules/admin/menu/categories/repository';
import { productRepo } from 'modules/admin/menu/products/repository/repo';
import { ingredientRepo } from 'modules/admin/menu/ingredients/repository';

export const menuService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const [ingredients, categories, products] = await Promise.all([
      ingredientRepo.getCount(),
      categoryRepo.getCount(),
      productRepo.getCount(),
    ]);

    return {
      ingredients: ingredients.ok ? ingredients.data.count : 0,
      categories: categories.ok ? categories.data.count : 0,
      products: products.ok ? products.data.count : 0,
    };
  },
};
