import { NextRequest, NextResponse } from 'next/server';
import { refreshAdminSession } from '@/src/modules/admin/admin-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = req.cookies.get('admin_refresh')?.value;

    if (!refreshToken) {
      return new NextResponse('No refresh token', { status: 401 });
    }

    const result = await refreshAdminSession(refreshToken);

    const response = new NextResponse('Token refreshed', { status: 200 });

    response.cookies.set('admin_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });

    if (result.newRefreshToken) {
      response.cookies.set('admin_refresh', result.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error('Refresh error:', error);

    const response = new NextResponse('Refresh failed', { status: 401 });
    response.cookies.delete('admin_token');
    response.cookies.delete('admin_refresh');
    return response;
  }
}
