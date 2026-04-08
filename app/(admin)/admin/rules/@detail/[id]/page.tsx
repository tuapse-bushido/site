import { JSX, Suspense } from 'react';
import { FormShell } from 'modules/admin/shared/ui/form-shell/form-shell';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RuleDetailsEditPage({ params }: Props): Promise<JSX.Element | null> {
  return (
    <Suspense fallback={'loading data'}>
      <FormShell
        params={params}
        token={'rule'}
        tagConfig={{
          base: 'addon-rules',
          prefix: 'rule-details-',
        }}
      />
    </Suspense>
  );
}
