import { JSX } from 'react';
import { UpdateProductScreen } from 'modules/admin/menu/products/screens';

export default async function UpdateProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element | null> {
  return <UpdateProductScreen params={params} />;
}
