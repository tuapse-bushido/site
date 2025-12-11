import { CacheProfileName } from '@/src/shared/types';
import { FormShellToken } from './form-shell.config';

export type FormShellProps = {
  params: Promise<{ id: string }>;
  token: FormShellToken;
  cacheProfile?: CacheProfileName;
};
