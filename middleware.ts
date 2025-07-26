import { adminAuthMiddleware } from './app/middleware/adminAuth.middleware'
import { NextRequest, NextResponse } from 'next/server'
// import { logger } from './lib/logger'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminAuthMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard',],
}