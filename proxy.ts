import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isLogin = path === '/admin/login';
  const isApiRoute = path.startsWith('/api/admin');

  const accessToken = req.cookies.get('admin_token')?.value;
  const refreshToken = req.cookies.get('admin_refresh')?.value;

  if (isAdminRoute && !isLogin && !refreshToken) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isLogin && refreshToken) {
    return NextResponse.redirect(new URL('/admin/orders', req.url));
  }

  if (!accessToken && refreshToken && !isApiRoute) {
    try {
      const refreshResponse = await fetch(new URL('/api/admin/auth/refresh', req.url), {
        method: 'POST',
        headers: {
          Cookie: req.headers.get('cookie') || '',
        },
      });

      if (refreshResponse.ok) {
        // Получаем новые cookies из response
        const setCookie = refreshResponse.headers.get('set-cookie');

        if (setCookie) {
          // Создаем response и устанавливаем новые cookies
          const response = NextResponse.next();
          response.headers.append('set-cookie', setCookie);
          return response;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      const response = NextResponse.redirect(new URL('/admin/login', req.url));

      response.cookies.delete('admin_token');
      response.cookies.delete('admin_refresh');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
