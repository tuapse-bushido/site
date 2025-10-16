import { ProductForm } from '@/components/forms/product/product-form';
import { JSX } from 'react';
import { actionProductInsert } from '@/utils/actions/product.action';
import { getAllProducts } from '@/libs/db/product/products.query';
import { getAllCategories } from '@/libs/db/category/category.query';
import { getAllIngredients } from '@/libs/db/ingredients/ingredients';
import { Category, Product } from '@/types';
import { Ingredient } from '@/types/db/tables/ingredient';

type OptionResult = {
  categories: Category[];
  ingredients: Ingredient[];
  products: Product[];
};

export const CreateProductPage = async (): Promise<JSX.Element> => {
  const getOptions = async (): Promise<OptionResult> => {
    const result: OptionResult = {
      categories: [],
      ingredients: [],
      products: [],
    };

    const products = await getAllProducts();
    const categories = await getAllCategories();
    const ingredients = await getAllIngredients();

    if (products.success && products.data) result.products = products.data;
    if (categories.success && categories.data) result.categories = categories.data;
    if (ingredients.success && ingredients.data) result.ingredients = ingredients.data;

    return result;
  };

  const { categories, products, ingredients } = await getOptions();

  return (
    <div>
      <ProductForm action={actionProductInsert} categories={categories} products={products} ingredients={ingredients} />
    </div>
  );
};
