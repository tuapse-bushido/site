import { FormShellToken } from './form-shell.config';
import { CacheProfileName } from '@/src/shared/types/cache-profile.types';

export type FormShellProps = {
  params: Promise<{ id: string }>;
  token: FormShellToken;
  cacheProfile?: CacheProfileName;
};
