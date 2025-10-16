'use server';

import { cookies } from 'next/headers';
import { createAccessToken } from '@/libs/auth/tokens';
import { createRefreshSession } from '@/libs/db/queries/admin-users/create-refresh-session';
import { StartSessionFn } from '@/types/session/session';
import { deleteSessionByAdminId } from '@/libs/db/queries/admin-users/delete-session-by-admin-id';
import { getRefreshSession } from '@/libs/db/queries/admin-users/get-refresh-session';
import { deleteRefreshSession } from '@/libs/db/queries/admin-users/delete-refresh-session';
import { getAdminById } from '@/libs/db/user/get-admin-by-id';

export const startSession: StartSessionFn = async (user): Promise<void> => {
  const cookieStore = await cookies();

  const accessToken = await createAccessToken({
    id: user.id,
    nickname: user.login,
    role: user.role,
  });

  const refreshTtlMs = 30 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + refreshTtlMs);

  await deleteSessionByAdminId(user.id);
  const uuid = await createRefreshSession(user.id, expiresAt);

  const cookieOptions = {
    httpOnly: true,
    secure: false, // пока локальная разработка, без HTTPS
    sameSite: 'lax' as const, // максимально безопасный вариант в dev
    path: '/',
  };

  cookieStore.set('admin_token', accessToken, {
    ...cookieOptions,
    maxAge: 60 * 2,
  });
  cookieStore.set('admin_refresh', uuid, {
    ...cookieOptions,
    maxAge: refreshTtlMs / 1000,
    expires: expiresAt,
  });
};

export const updateSession = async (redirectTo: string): Promise<Response | null> => {
  const cookieStore = await cookies();
  const refreshId = cookieStore.get('admin_refresh')?.value;

  if (!refreshId) return null;

  const session = await getRefreshSession(refreshId);

  const isInvalid = !session || session.is_revoked || session.expires_at < new Date();

  if (isInvalid) {
    if (session?.id) {
      await deleteRefreshSession(session.id);
    }

    const response = new Response(null, { status: 302 });
    response.headers.set('Location', redirectTo);
    response.headers.append('Set-Cookie', `admin_refresh=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
    response.headers.append('Set-Cookie', `admin_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);

    return response;
  }

  const admin = await getAdminById(session.admin_id);
  if (!admin) return null;

  const newAccessToken = await createAccessToken({
    id: admin.id,
    login: admin.login,
    role: admin.role,
  });

  const response = new Response(null, { status: 302 });
  response.headers.set('Location', redirectTo);
  response.headers.append('Set-Cookie', `admin_token=${newAccessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=120`);

  return response;
};
