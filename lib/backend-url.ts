export function backendUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api').replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
}
