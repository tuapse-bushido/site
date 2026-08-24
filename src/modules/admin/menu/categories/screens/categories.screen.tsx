import { JSX } from 'react';
import { Category } from 'shared/entites/category';
import { EntityPage } from 'modules/admin/shared/ui/entity-page-template';

type Props = {
  categories: Category[];
};

export const CategoriesScreen = ({ categories }: Props): JSX.Element => {
  return <EntityPage type={'categories'} data={categories} />;
};
