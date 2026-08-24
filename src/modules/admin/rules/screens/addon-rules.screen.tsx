import { JSX } from 'react';
import { AddonRule } from 'modules/admin/rules/entities';
import { EntityPage } from 'modules/admin/shared/ui/entity-page-template';

type Props = {
  rules: AddonRule[];
};

export const AddonRulesScreen = ({ rules }: Props): JSX.Element => {
  return <EntityPage type={'addonRules'} data={rules} />;
};
