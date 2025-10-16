import { Category, Product, ProductWithDetails } from '@/types';
import { Ingredient } from '@/types/db/tables/ingredient';

export type ProductProps = {
  product?: ProductWithDetails;
  categories: Category[];
  ingredients: Ingredient[];
  products: Product[];
  action: (
    prevState: {
      message: string;
      success: boolean;
    } | null,
    formData: FormData,
    product?: ProductWithDetails,
  ) => Promise<{ message: string; success: boolean }>;
};
