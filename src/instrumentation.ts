export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getTokenPolicy } = await import('./lib/token-policy');
    getTokenPolicy();
  }
}
