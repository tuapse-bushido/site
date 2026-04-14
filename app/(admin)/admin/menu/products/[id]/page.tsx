import { JSX, Suspense } from 'react';
import { FormShell } from 'modules/admin/shared/ui/form-shell/form-shell';

export default async function UpdateProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element | null> {
  return (
    <Suspense fallback="loading your inbox...">
      <FormShell params={params} token="product" cacheProfile={'admin'} />
    </Suspense>
  );
}
