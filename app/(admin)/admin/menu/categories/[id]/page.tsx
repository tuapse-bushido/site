import { JSX, Suspense } from 'react';
import { FormShell } from 'modules/admin/shared/ui/form-shell/form-shell';

export default async function UpdateCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  return (
    <Suspense fallback="loading your inbox...">
      <FormShell params={params} token="category" cacheProfile={'admin'} />
    </Suspense>
  );
}
