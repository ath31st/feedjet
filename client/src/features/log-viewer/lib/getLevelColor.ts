import { LogLevel } from '@/entities/log';

export const getLevelColor = (level: number) => {
  switch (level) {
    case LogLevel.Trace:
    case LogLevel.Debug:
      return 'text-gray-500';
    case LogLevel.Info:
      return 'text-blue-500';
    case LogLevel.Warn:
      return 'text-yellow-500';
    case LogLevel.Error:
      return 'text-red-500';
    case LogLevel.Fatal:
      return 'text-red-700 font-bold';
    default:
      return 'text-gray-400';
  }
};
