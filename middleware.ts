import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    const refreshId = request.cookies.get('admin_refresh')?.value;
    if (refreshId) {
      const refreshUrl = new URL('/api/session/refresh', request.url);
      refreshUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(refreshUrl);
    }

    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp - now < 60) {
      const refreshUrl = new URL('/api/session/refresh', request.url);
      refreshUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(refreshUrl);
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
