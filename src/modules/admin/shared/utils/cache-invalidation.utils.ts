import { updateTag } from 'next/cache';

const invalidateTags = (...tags: string[]): void => {
  tags.forEach((tag): void => updateTag(tag));
};

const invalidateCatalog = (): void => {
  invalidateTags('products', 'catalog', 'client-pages');
};

export const invalidateProductCache = (): void => {
  invalidateTags('addon-rules', 'admin-pages');
  invalidateCatalog();
};

export const invalidateCategoryCache = (): void => {
  invalidateTags('categories', 'addon-rules', 'admin-pages');
  invalidateCatalog();
};

export const invalidateIngredientCache = (): void => {
  invalidateTags('ingredients', 'admin-pages');
  invalidateCatalog();
};

export const invalidateAddonRuleCache = (): void => {
  invalidateTags('addon-rules', 'admin-pages');
  invalidateCatalog();
};
