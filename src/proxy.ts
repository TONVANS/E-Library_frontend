import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/api-config';

type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

interface TokenPayload {
  sub: string;
  role: Role;
  exp?: number;
}

// Optimistic check only: decodes the JWT without verifying the signature.
// The backend still verifies every API call, so a forged cookie only reaches an empty page.
function readToken(token?: string): TokenPayload | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(json) as TokenPayload;
    if (data.exp && data.exp * 1000 < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

// Longest prefix first; mirrors the role lists in AdminSidebar
const PROTECTED_ROUTES: { prefix: string; roles: Role[] }[] = [
  { prefix: '/admin/docs', roles: ['ADMIN', 'TEACHER'] },
  { prefix: '/admin', roles: ['ADMIN'] },
  { prefix: '/profile', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
];

function homeFor(role: Role) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'TEACHER') return '/admin/docs';
  return '/';
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const user = readToken(request.cookies.get(AUTH_COOKIE)?.value);

  // nextUrl.clone() keeps basePath, so redirects stay under /elibrary
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = '';
    return url;
  };

  if (pathname === '/login') {
    return user ? NextResponse.redirect(redirectTo(homeFor(user.role))) : NextResponse.next();
  }

  const route = PROTECTED_ROUTES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
  );
  if (!route) return NextResponse.next();

  if (!user) {
    const url = redirectTo('/login');
    url.searchParams.set('redirect', `${pathname}${search}`);
    const res = NextResponse.redirect(url);
    // Drop an expired/malformed token so the client doesn't keep sending it
    res.cookies.delete(AUTH_COOKIE);
    return res;
  }

  if (!route.roles.includes(user.role)) {
    return NextResponse.redirect(redirectTo(homeFor(user.role)));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/login'],
};
