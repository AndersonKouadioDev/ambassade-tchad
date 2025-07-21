import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }
  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    '/',
    '/fr/espace-client/:path*',
    '/en/espace-client/:path*',
    '/ar/espace-client/:path*'
  ]
};