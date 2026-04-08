import { JSX, Suspense } from 'react';
import { FormShell } from 'src/modules/admin/shared/ui/form-shell/form-shell';

export default async function UpdateIngredientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element | null> {
  return (
    <Suspense fallback="loading your inbox...">
      <FormShell params={params} token="ingredient" cacheProfile={'admin'} />
    </Suspense>
  );
}
