import { JSX } from 'react';
import { ProductForm } from 'modules/admin/menu/products/features/product-form/ui/product-form';
import { getProductEditData } from '../../../../../../src/modules/admin/menu/products/use-cases';

export default async function CreateProductPage(): Promise<JSX.Element | null> {
  const productData = await getProductEditData();

  if (!productData.ok) return null;

  return <ProductForm productData={productData.data} />;
}
