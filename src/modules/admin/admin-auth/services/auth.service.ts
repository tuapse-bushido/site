import { cookies } from 'next/headers';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { Admin, getAdminById } from '@/src/modules/admin/shared';
import { createRefreshSession, deleteRefreshSession, deleteSessionByAdminId, getRefreshSession } from '../index';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export const createAccessToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('15m').sign(JWT_SECRET);
};

export const startSession = async (user: Admin): Promise<void> => {
  const cookieStore = await cookies();

  const accessToken = await createAccessToken({
    id: user.id,
    nickname: user.login,
    role: user.role,
  });

  const refreshTtlMs = 30 * 24 * 60 * 60 * 1000; // 30 дней
  const expiresAt = new Date(Date.now() + refreshTtlMs);

  await deleteSessionByAdminId(user.id);

  // Получаем результат создания сессии
  const refreshSessionResult = await createRefreshSession(user.id, expiresAt);

  // Проверяем успешность операции
  if (!refreshSessionResult.ok) {
    throw new Error(`Failed to create refresh session: ${refreshSessionResult.code}`);
  }

  // Извлекаем ID из результата
  const refreshTokenId = refreshSessionResult.data.id;

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    path: '/',
  };

  cookieStore.set('admin_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60,
  });

  cookieStore.set('admin_refresh', refreshTokenId, {
    ...cookieOptions,
    maxAge: refreshTtlMs / 1000,
    expires: expiresAt,
  });
};

export async function refreshAdminSession(refreshTokenId: string): Promise<{
  success: boolean;
  accessToken: string;
  newRefreshToken?: string;
}> {
  try {
    // 1. Получаем и проверяем сессию
    const sessionResult = await getRefreshSession(refreshTokenId);

    if (!sessionResult.ok) {
      return { success: false, accessToken: '' };
    }

    const session = sessionResult.data;

    if (session.is_revoked || new Date() > new Date(session.expires_at)) {
      return { success: false, accessToken: '' };
    }

    // 2. Получаем данные администратора
    const adminResponse = await getAdminById(session.admin_id);
    if (!adminResponse.ok) {
      return { success: false, accessToken: '' };
    }

    const admin = adminResponse.data;

    // 3. Генерируем новые токены
    const accessToken = await createAccessToken({
      id: admin.id,
      nickname: admin.login,
      role: admin.role,
    });

    // 4. Создаем новую refresh сессию (ротация)
    await deleteRefreshSession(refreshTokenId);

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 30); // 30 дней

    const newRefreshTokenResult = await createRefreshSession(admin.id, newExpiresAt);

    if (!newRefreshTokenResult.ok) {
      console.error('Failed to create new refresh token:', newRefreshTokenResult.code);
      return { success: false, accessToken: '' };
    }

    const newRefreshToken = newRefreshTokenResult.data.id;

    return {
      success: true,
      accessToken,
      newRefreshToken,
    };
  } catch (error) {
    console.error('Refresh session error:', error);

    // В случае ошибки пытаемся удалить refresh сессию
    try {
      await deleteRefreshSession(refreshTokenId);
    } catch (deleteError) {
      console.error('Failed to delete refresh session:', deleteError);
    }

    return { success: false, accessToken: '' };
  }
}
