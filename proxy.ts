import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ErrorCode } from './src/shared/types/error-codes.types';
import { sessionService, tokenService } from './src/modules/admin/admin-auth/services';

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('admin_access')?.value;
  const refreshToken = req.cookies.get('admin_refresh')?.value;

  const accessPayload = accessToken ? await tokenService.verifyAccessToken(accessToken) : null;

  function getReturnTo(req: NextRequest): string {
    const returnTo = req.nextUrl.searchParams.get('returnTo');

    if (
      !returnTo ||
      !returnTo.startsWith('/admin') ||
      returnTo.startsWith('//') ||
      returnTo.startsWith('/admin/login')
    ) {
      return '/admin/orders';
    }

    return returnTo;
  }

  if (accessPayload) {
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL(getReturnTo(req), req.url));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    const refreshResult = await sessionService.refreshSession(refreshToken);

    if (refreshResult.ok) {
      const { accessToken, refreshToken: newRefreshToken, refreshExpiresAt } = refreshResult.data;

      const response =
        pathname === '/admin/login' ? NextResponse.redirect(new URL(getReturnTo(req), req.url)) : NextResponse.next();

      response.cookies.set('admin_access', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });

      response.cookies.set('admin_refresh', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: refreshExpiresAt,
      });

      return response;
    }

    if (refreshResult.code !== ErrorCode.UNAUTHORIZED) {
      return new NextResponse('Service unavailable', {
        status: 503,
      });
    }
  }

  if (pathname === '/admin/login') {
    const response = NextResponse.next();

    response.cookies.delete('admin_access');
    response.cookies.delete('admin_refresh');

    return response;
  }

  const loginUrl = new URL('/admin/login', req.url);

  loginUrl.searchParams.set('returnTo', `${pathname}${req.nextUrl.search}`);

  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete('admin_access');
  response.cookies.delete('admin_refresh');

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
