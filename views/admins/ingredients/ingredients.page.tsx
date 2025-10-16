import { JSX } from 'react';
import { getAllIngredients } from '@/libs/db/ingredients/ingredients';
import Link from 'next/link';
import { ingredientColumns, titleColumns } from '@/utils/configs/table-columns';
import { TableComponent } from '@/components/ui/table/table';
import { Ingredient } from '@/types/db/tables/ingredient';

export const IngredientsPage = async (): Promise<JSX.Element | null> => {
  const ingredients = await getAllIngredients();

  if (!ingredients.success) return null;

  return (
    <div>
      <h1>Ингредиенты</h1>
      <Link href="/admin/menu/ingredients/create" className="bg-blue-500 text-white px-4 py-2 rounded">
        Добавить ингредиент
      </Link>

      <TableComponent<Ingredient>
        data={ingredients.data}
        mapColumns={ingredientColumns}
        slug={'ingredients'}
        titleColumns={titleColumns}
      />
    </div>
  );
};
