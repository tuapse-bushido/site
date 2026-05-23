import { JSX } from 'react';
import { UpdateCategoryScreen } from 'modules/admin/menu/categories';

export default async function UpdateCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  return <UpdateCategoryScreen params={params} />;
}
