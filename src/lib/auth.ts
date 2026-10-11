import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { getTokenPolicy } from './token-policy';

const TOKEN_COOKIE_NAME = 'sportoto_token';
const ISSUER = 'sportotoiddia';
const AUDIENCE = 'sportoto-app';

export class AuthStoreError extends Error {
  readonly status = 503;
  constructor() { super('Güncel hesap yetkileri doğrulanamıyor.'); }
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  const { secret, version } = getTokenPolicy();
  return jwt.sign({userId: payload.userId, email: payload.email, role: payload.role, v: version}, secret,
    { algorithm: 'HS256', expiresIn: '30d', issuer: ISSUER, audience: AUDIENCE });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const { secret, version } = getTokenPolicy();
    const payload = jwt.verify(token, secret, {algorithms: ['HS256'], issuer: ISSUER, audience: AUDIENCE});
    if (typeof payload === 'string' || payload.v !== version || typeof payload.exp !== 'number' ||
        typeof payload.userId !== 'string' || !payload.userId ||
        typeof payload.email !== 'string' || !payload.email || typeof payload.role !== 'string') return null;
    return {userId: payload.userId, email: payload.email, role: payload.role};
  } catch {
    return null;
  }
}

async function currentTokenUser(token: string): Promise<TokenPayload | null> {
  const claims = verifyToken(token);
  if (!claims) return null;
  let user;
  try {
    user = await prisma.user.findUnique({where: {id: claims.userId}, select: {id: true, email: true, role: true}});
  } catch { throw new AuthStoreError(); }
  return user ? {userId: user.id, email: user.email, role: user.role} : null;
}

export async function getSessionUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await currentTokenUser(token);
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value ||
    req.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/)?.[1];
  if (!token) return null;
  return currentTokenUser(token);
}

export const AUTH_COOKIE_OPTIONS = {
  name: TOKEN_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 gün
};
