import { JSX } from 'react';
import { ProductEditData } from 'modules/admin/menu/products/entities';
import { FormResetContainer } from 'modules/admin/shared/ui/form-reset-container';
import { ProductFormContent } from 'modules/admin/menu/products/features/product-form-content';

type Props = {
  productData: ProductEditData;
};

export const ProductForm = ({ productData }: Props): JSX.Element => {
  return (
    <FormResetContainer>
      <ProductFormContent productData={productData} />
    </FormResetContainer>
  );
};
