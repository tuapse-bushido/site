import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const makeRefreshRedirect = (request: NextRequest, redirectTo: string): NextResponse => {
  const refreshUrl = new URL('/api/session/refresh', request.url);
  refreshUrl.searchParams.set('redirect', redirectTo);
  return NextResponse.redirect(refreshUrl);
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('admin_token')?.value;
  const refreshToken = request.cookies.get('admin_refresh')?.value;

  if (pathname === '/admin/login') {
    if (token) {
      try {
        await jwtVerify(token, secret);

        return NextResponse.redirect(new URL('/admin/orders', request.url));
      } catch {
        if (refreshToken) return makeRefreshRedirect(request, '/admin/orders');

        return NextResponse.next();
      }
    }

    if (!token && refreshToken) return makeRefreshRedirect(request, '/admin/orders');

    return NextResponse.next();
  }

  // ===============================================
  //  ОСТАЛЬНЫЕ АДМИН-МАРШРУТЫ
  // ===============================================

  // Нет токена → пробуем refresh
  if (!token) {
    if (refreshToken) {
      return makeRefreshRedirect(request, pathname);
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Проверяем токен
  try {
    const { payload } = await jwtVerify(token, secret);

    const now = Date.now() / 1000;

    // Осталась 1 минута → refresh
    if (payload.exp && payload.exp - now < 60) {
      return makeRefreshRedirect(request, pathname);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
