/** Sırlar ortamdan alınır; kaynak kodunda yedek imza anahtarı bulunmaz. */
export function getTokenPolicy() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET en az 32 baytlık harici bir anahtar olmalıdır.');
  }
  const version = process.env.AUTH_TOKEN_VERSION?.trim() ?? '1';
  if (!version || version.length > 64) throw new Error('AUTH_TOKEN_VERSION geçersiz.');
  return { secret, version };
}
