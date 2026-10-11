import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {randomBytes} from 'node:crypto';
const require = createRequire(import.meta.url);
const ts = require('typescript'), jwt = require('jsonwebtoken'), bcrypt = require('bcryptjs');
const {NextRequest, NextResponse} = require('next/server');
const secret = randomBytes(32).toString('hex');
const env = {NODE_ENV: 'production', NEXT_RUNTIME: 'nodejs', JWT_SECRET: secret, AUTH_TOKEN_VERSION: 'fixture-1'};

function load(file, imports) {
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true
  }}).outputText;
  const exports = {};
  vm.runInNewContext(code, {exports, require(id) {
    if (!(id in imports)) throw Error('Beklenmeyen içe aktarma: ' + id);
    return imports[id];
  }, process: {env}, Buffer, Error, URL, console}, {filename: file});
  return exports;
}
const policy = load('src/lib/token-policy.ts', {});
const startup = load('src/instrumentation.ts', {'./lib/token-policy': policy});
function fixture(realDb) {
  env.JWT_SECRET = secret; env.AUTH_TOKEN_VERSION = 'fixture-1';
  let user = {id: 'fixture-user', email: 'operator@example.test', role: 'ADMIN'};
  let cookie = null, error = false, reads = 0;
  const operations = [];
  const prisma = realDb ?? {
    user: {async findUnique() {reads++; if (error) throw Error('Kurgusal depo hatası'); return user;}},
    kupon: {
      async findMany(args) {operations.push(['list', args]); return [];},
      async create(args) {operations.push(['create', args]); return {id: 'fixture-coupon'};},
      async deleteMany(args) {operations.push(['delete', args]); return {count: 0};}
    }
  };
  const auth = load('src/lib/auth.ts', {'bcryptjs': bcrypt, 'jsonwebtoken': jwt, 'next/headers': {
    cookies: async () => ({get: () => cookie ? {value: cookie} : undefined})
  }, 'next/server': {NextRequest}, './prisma': {prisma}, './token-policy': policy});
  const routes = load('src/app/api/kuponlar/route.ts', {'next/server': {NextRequest, NextResponse},
    '@/lib/prisma': {prisma}, '@/lib/auth': auth});
  const me = load('src/app/api/auth/me/route.ts', {'next/server': {NextRequest, NextResponse},
    '@/lib/prisma': {prisma}, '@/lib/auth': auth});
  const token = auth.signToken({userId: user.id, email: user.email, role: user.role});
  const request = (method = 'GET', custom = token) => new NextRequest('https://fixture.test/api/kuponlar?id=foreign-coupon', {
    method, headers: custom ? {authorization: 'Bearer ' + custom, 'content-type': 'application/json'} : {},
    ...(method === 'POST' ? {body: JSON.stringify({title: 'Kurgusal', hafta: 1, maclar: [], toplamKolon: 1, maliyet: 0, userId: 'foreign'})} : {})
  });
  return {auth, routes, me, token, request, operations, reads: () => reads,
    user: () => user, setUser: value => {user = value;}, setError: value => {error = value;},
    setCookie: value => {cookie = value;}};
}

for (const value of [undefined, '', 'short', ' '.repeat(40)]) {
  test('Node başlangıcı eksik veya zayıf JWT anahtarını reddeder: ' + String(value), async () => {
    const previous = env.JWT_SECRET; env.JWT_SECRET = value;
    try { await assert.rejects(startup.register(), /JWT_SECRET/); }
    finally { env.JWT_SECRET = previous; }
  });
}
test('Harici anahtar ile gerçek JWT imzası, süresi ve kimliği doğrulanır', async () => {
  const f = fixture(); const decoded = jwt.verify(f.token, secret, {algorithms: ['HS256'], issuer: 'sportotoiddia', audience: 'sportoto-app'});
  assert.equal(decoded.userId, 'fixture-user'); assert.equal(decoded.v, 'fixture-1');
  assert(decoded.exp > decoded.iat);
  assert.equal((await f.auth.getAuthUser(f.request())).role, 'ADMIN');
});
test('İmza anahtarı değişince eski token reddedilir', async () => {
  const f = fixture(); env.JWT_SECRET = randomBytes(32).toString('hex');
  try { assert.equal(await f.auth.getAuthUser(f.request()), null); assert.equal(f.reads(), 0); }
  finally {env.JWT_SECRET = secret;}
});
test('Oturum sürümü yükselince eski token reddedilir', async () => {
  const f = fixture(); env.AUTH_TOKEN_VERSION = 'fixture-2';
  try {assert.equal(await f.auth.getAuthUser(f.request()), null); assert.equal(f.reads(), 0);}
  finally {env.AUTH_TOKEN_VERSION = 'fixture-1';}
});
const claims = {userId: 'fixture-user', email: 'operator@example.test', role: 'ADMIN', v: 'fixture-1'};
for (const [name, make] of [
  ['süresi geçmiş', () => jwt.sign(claims, secret, {expiresIn: -1, issuer: 'sportotoiddia', audience: 'sportoto-app'})],
  ['farklı anahtar', () => jwt.sign(claims, randomBytes(32).toString('hex'), {expiresIn: 60, issuer: 'sportotoiddia', audience: 'sportoto-app'})],
  ['izin verilmeyen algoritma', () => jwt.sign(claims, secret, {algorithm: 'HS512', expiresIn: 60, issuer: 'sportotoiddia', audience: 'sportoto-app'})],
  ['eksik süre', () => jwt.sign(claims, secret, {issuer: 'sportotoiddia', audience: 'sportoto-app'})],
  ['yanlış hedef', () => jwt.sign(claims, secret, {expiresIn: 60, issuer: 'sportotoiddia', audience: 'foreign-app'})],
  ['bozuk kimlik', () => jwt.sign({...claims, userId: 9}, secret, {expiresIn: 60, issuer: 'sportotoiddia', audience: 'sportoto-app'})]
]) {
  test(name + ' token veritabanı okunmadan reddedilir', async () => {
    const f = fixture(); assert.equal(await f.auth.getAuthUser(f.request('GET', make())), null); assert.equal(f.reads(), 0);
  });
}
test('Geçerli eski token güncel hesap rolünü ve e-postasını kullanır', async () => {
  const f = fixture(); f.setUser({...f.user(), role: 'USER', email: 'changed@example.test'});
  const user = await f.auth.getAuthUser(f.request()); assert.equal(user.role, 'USER'); assert.equal(user.email, 'changed@example.test');
  f.setCookie(f.token); assert.equal((await f.auth.getSessionUser()).role, 'USER');
});
test('Silinen hesap eski tokenla kupon listeleyemez veya değiştiremez', async () => {
  const f = fixture(); f.setUser(null);
  for (const method of ['GET', 'POST', 'DELETE']) assert.equal((await f.routes[method](f.request(method))).status, 401);
  assert.equal(f.operations.length, 0);
});
test('Kullanıcı deposu hatasında kupon işlemleri 503 verir', async () => {
  const f = fixture(); f.setError(true);
  for (const method of ['GET', 'POST', 'DELETE']) assert.equal((await f.routes[method](f.request(method))).status, 503);
  assert.equal((await f.me.GET(f.request())).status, 503); assert.equal(f.operations.length, 0);
});
test('Anonim istekler kupon deposuna ulaşamaz', async () => {
  const f = fixture();
  for (const method of ['GET', 'POST', 'DELETE']) assert.equal((await f.routes[method](f.request(method, null))).status, 401);
  assert.equal(f.operations.length, 0); assert.equal(f.reads(), 0);
});
test('Gerçek Next kupon rotaları GET, POST ve DELETE için hesap sahipliğini korur', async () => {
  const f = fixture();
  for (const method of ['GET', 'POST', 'DELETE']) assert.equal((await f.routes[method](f.request(method))).status, 200);
  assert.equal(f.operations[0][1].where.userId, 'fixture-user');
  assert.equal(f.operations[1][1].data.userId, 'fixture-user');
  assert.equal(f.operations[2][1].where.userId, 'fixture-user');
  assert.equal(f.operations[2][1].where.id, 'foreign-coupon');
});
test('Token taşıyan fakat Bearer olmayan başlık reddedilir', async () => {
  const f = fixture(); assert.equal(await f.auth.getAuthUser(new NextRequest('https://fixture.test', {headers: {authorization: f.token}})), null);
});

const pgUrl = process.env.SPORTOTO_TEST_DATABASE_URL;
if (process.env.CI && !pgUrl) throw Error('CI için ayrı SPORTOTO_TEST_DATABASE_URL zorunludur.');
(pgUrl ? test : test.skip)('Gerçek Prisma/PostgreSQL: eski JWT rol değişimini ve hesap silmeyi atlayamaz', async () => {
  const connection = new URL(pgUrl);
  assert(['127.0.0.1', 'localhost'].includes(connection.hostname)); assert.equal(connection.pathname, '/codex_sportoto_test');
  const schema = 'auth_test_' + process.pid; connection.searchParams.set('schema', schema);
  const {PrismaClient} = require('@prisma/client');
  const db = new PrismaClient({datasources: {db: {url: connection.toString()}}});
  try {
    assert.equal((await db.$queryRawUnsafe('SELECT current_database() AS name'))[0].name, 'codex_sportoto_test');
    await db.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
    await db.$executeRawUnsafe(`CREATE TABLE "${schema}"."User"(id TEXT PRIMARY KEY,email TEXT,role TEXT)`);
    await db.$executeRawUnsafe(`INSERT INTO "${schema}"."User" VALUES('fixture-user','operator@example.test','ADMIN')`);
    const f = fixture(db); assert.equal((await f.auth.getAuthUser(f.request())).role, 'ADMIN');
    await db.$executeRawUnsafe(`UPDATE "${schema}"."User" SET role='USER'`);
    assert.equal((await f.auth.getAuthUser(f.request())).role, 'USER');
    await db.$executeRawUnsafe(`DELETE FROM "${schema}"."User"`);
    assert.equal(await f.auth.getAuthUser(f.request()), null);
  } finally {
    try {await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);} finally {await db.$disconnect();}
  }
});
