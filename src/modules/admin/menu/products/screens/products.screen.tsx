import { JSX } from 'react';
import { Product } from 'modules/admin/menu/products/entities';
import { EntityPage } from 'modules/admin/shared/ui/entity-page-template';

type Props = {
  products: Product[];
};

export const ProductsScreen = ({ products }: Props): JSX.Element => {
  return <EntityPage type={'products'} data={products} />;
};
