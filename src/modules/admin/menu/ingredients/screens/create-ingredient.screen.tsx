import { JSX } from 'react';
import { PageContainer } from 'modules/admin/shared/ui/page-container';
import { IngredientForm } from 'modules/admin/menu/ingredients/widgets';

export const CreateIngredientScreen = (): JSX.Element => {
  return (
    <PageContainer title={'Новый ингредиент'}>
      <IngredientForm />
    </PageContainer>
  );
};
