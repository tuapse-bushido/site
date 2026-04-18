import { JSX, Suspense } from 'react';
import { FormShell } from 'modules/admin/shared/ui/form-shell/form-shell';
import { UpdateIngredientScreen } from 'modules/admin/menu/ingredients/screens';

export default async function UpdateIngredientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element | null> {
  return (
    <UpdateIngredientScreen>
      <Suspense fallback="loading your inbox...">
        <FormShell
          params={params}
          token="ingredient"
          cacheProfile={'admin'}
          tagConfig={{ base: 'admin-pages', prefix: 'ingredient-page-' }}
        />
      </Suspense>
    </UpdateIngredientScreen>
  );
}
