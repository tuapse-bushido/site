import { JSX } from 'react';
import { ProductForm } from 'modules/admin/menu/products/widgets/product-form';
import { productCases } from 'modules/admin/menu/products/use-cases';
import { PageContainer } from 'modules/admin/shared/ui/page-container';

export default async function CreateProductPage(): Promise<JSX.Element | null> {
  const productData = await productCases.getProductEditData();

  if (!productData.ok) return null;

  return (
    <PageContainer title="Новый продукт">
      <ProductForm productData={productData.data} />
    </PageContainer>
  );
}
