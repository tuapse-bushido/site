import { JSX } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { RulesScreen } from 'modules/admin/rules';
import { addonRuleRepo } from 'modules/admin/rules/repository';

export default async function RulesPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');
  cacheTag(`rules-page`);

  const rules = await addonRuleRepo.rule.getAddonRules();

  if (!rules.ok) return null;

  return <RulesScreen rules={rules.data} />;
}
