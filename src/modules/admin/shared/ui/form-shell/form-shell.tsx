'use server';

import { ElementType, JSX } from 'react';
import { cacheLife } from 'next/cache';
import { FormShellProps } from './from-shell.props';
import { formShellRegistry } from 'src/modules/admin/shared/ui/form-shell/form-shell.config';

export async function FormShell({
  params,
  token,
  cacheProfile = 'admin',
}: FormShellProps): Promise<JSX.Element | null> {
  'use cache';
  if (cacheProfile) cacheLife(cacheProfile);

  const { id } = await params;

  const config = formShellRegistry[token];
  // 2. Приводим компонент к ElementType
  const Component = config.Component as ElementType;
  const { fetch, propName } = config;

  const result = await fetch(Number(id));
  if (!result.ok || !result.data) return null;

  // 3. Теперь TS позволит прокинуть объект с любым ключом
  const componentProps = {
    [propName]: result.data,
  };

  return <Component {...componentProps} />;
}
