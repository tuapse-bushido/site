import { JSX } from 'react';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { EntityPage } from 'modules/admin/shared/ui/entity-page-template';

type Props = {
  ingredients: Ingredient[];
};

export const IngredientsScreen = ({ ingredients }: Props): JSX.Element => {
  return <EntityPage type={'ingredients'} data={ingredients} />;
};
