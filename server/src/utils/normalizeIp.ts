export function normalizeIp(ip: string | undefined | null): string {
  if (!ip) return 'unknown';

  if (ip.startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }

  return ip;
}
