import { LogLevel } from '@/entities/log';

export const getLevelName = (level: number) =>
  Object.keys(LogLevel).find(
    (key) => LogLevel[key as keyof typeof LogLevel] === level,
  ) ?? 'UNKNOWN';
