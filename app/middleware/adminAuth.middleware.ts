import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '../lib/supabase/server';

export async function adminAuthMiddleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const protectedRoutes = ['/admin/dashboard',];

  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (data == null) {
      return NextResponse.redirect(new URL('/auth', request.url));
    } else if (data?.user?.user_metadata?.is_admin !== true) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}