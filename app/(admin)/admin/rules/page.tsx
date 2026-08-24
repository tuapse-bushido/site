import { JSX } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { AddonRulesScreen } from 'modules/admin/rules';
import { addonRuleRepo } from 'modules/admin/rules/repository';

export default async function RulesPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');
  cacheTag('admin-pages', 'rules-page');

  const rules = await addonRuleRepo.getAddonRules();

  if (!rules.ok) return null;

  return <AddonRulesScreen rules={rules.data} />;
}
