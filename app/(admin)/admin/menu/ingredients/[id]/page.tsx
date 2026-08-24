import { JSX } from 'react';
import { UpdateIngredientScreen } from 'modules/admin/menu/ingredients/screens';

export default async function UpdateIngredientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element | null> {
  return <UpdateIngredientScreen params={params} />;
}
