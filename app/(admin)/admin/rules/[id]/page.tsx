import { JSX } from 'react';
import { UpdateAddonRuleScreen } from 'modules/admin/rules/screens';

export default async function UpdateRulePage({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  return <UpdateAddonRuleScreen params={params} />;
}
