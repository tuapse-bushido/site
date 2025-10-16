import { updateSession } from '@/libs/session/session';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/admin/dashboard';

  const response = await updateSession(redirectTo);
  return response ?? Response.redirect('/admin/login');
}
