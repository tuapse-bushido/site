'use server';

import { cacheLife } from 'next/cache';
import { FormShellProps } from './from-shell.props';
import { formShellRegistry } from '@/src/modules/admin/shared/ui/form-shell/form-shell.config';
import { JSX } from 'react';

export async function FormShell({
  params,
  token,
  cacheProfile = 'admin',
}: FormShellProps): Promise<JSX.Element | null> {
  'use cache';
  if (cacheProfile) cacheLife(cacheProfile);

  const { id } = await params;

  const config = formShellRegistry[token];
  const { fetch, Component, propName } = config;

  const result = await fetch(Number(id));
  if (!result.ok || !result.data) return null;

  const props = { [propName]: result.data };

  return <Component {...props} />;
}
