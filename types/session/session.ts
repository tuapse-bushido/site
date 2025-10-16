import { AdminType } from '@/types/db/tables/admin';

export type StartSessionFn = (user: AdminType) => Promise<void>;
