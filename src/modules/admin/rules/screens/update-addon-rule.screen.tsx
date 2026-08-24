import { JSX, Suspense } from 'react';
import { PageContainer } from 'modules/admin/shared/ui/page-container';
import { FormShell } from 'modules/admin/shared/ui/form-shell/form-shell';

type Props = {
  params: Promise<{ id: string }>;
};

export const UpdateAddonRuleScreen = ({ params }: Props): JSX.Element => {
  return (
    <PageContainer title={'Редактирование правила'}>
      <Suspense fallback="loading your inbox...">
        <FormShell
          params={params}
          token="rule"
          cacheProfile={'admin'}
          tagConfig={{ base: 'admin-pages', prefix: 'addon-rule-page-' }}
        />
      </Suspense>
    </PageContainer>
  );
};
