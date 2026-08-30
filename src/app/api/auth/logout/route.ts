import { NextResponse } from 'next/server';
import { AUTH_COOKIE_OPTIONS } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ message: 'Çıkış yapıldı.' });
  res.cookies.set(AUTH_COOKIE_OPTIONS.name, '', {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return res;
}
