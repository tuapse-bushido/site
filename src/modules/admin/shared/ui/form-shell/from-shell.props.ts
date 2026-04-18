import { FormShellToken } from './form-shell.config';
import { CacheProfileName } from 'shared/types/cache-profile.types';

export type FormShellProps = {
  params: Promise<{ id: string }>;
  token: FormShellToken;
  tagConfig?: {
    base: string;
    prefix: string;
  };
  cacheProfile?: CacheProfileName;
};
