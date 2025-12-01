import type { Request } from 'express';

export function extractRealIp(req: Request): string {
  const xff = req.headers['x-forwarded-for'];

  if (typeof xff === 'string' && xff.length > 0) {
    const clientIp = xff.split(',')[0].trim();
    return normalize(clientIp);
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return normalize(realIp);
  }

  return normalize(req.socket.remoteAddress ?? 'unknown');
}

function normalize(ip: string): string {
  return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
}
