import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname, search } = req.nextUrl;

  // /boards 이하 보호
  if (pathname.startsWith('/boards') && !token) {
    const loginUrl = new URL('/login', req.url);
    // 로그인 후 돌아올 위치 저장
    loginUrl.searchParams.set('redirectTo', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// /boards 경로만 매칭
export const config = {
  matcher: ['/boards/:path*'],
};
