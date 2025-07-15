import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const { data: { session } } = await supabase.auth.getSession();
  const path = request.nextUrl.pathname;

  const protectedRoutes = ['/dashboard', '/admin'];
  const adminRoutes = ['/admin'];

  if (!session && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session) {
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (adminRoutes.some(route => path.startsWith(route)) && !userData?.is_admin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return response;
}