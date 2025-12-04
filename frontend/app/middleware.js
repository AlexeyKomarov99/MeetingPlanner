import { NextResponse } from 'next/server';
import { verifyToken } from '../lib/auth';

export async function middleware(request) {
  console.log('🛡️ Middleware запущен для:', request.nextUrl.pathname);
  console.log('🍪 Token:', request.cookies.get('access_token')?.value);
  
  const token = request.cookies.get('access_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  
  // Проверяем JWT токен
  const isValid = token ? await verifyToken(token) : false;
  
  // Если не авторизован и не на странице auth - редирект на login
  if (!isValid && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Если авторизован и на странице auth - редирект на главную
  if (isValid && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};