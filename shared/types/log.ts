export interface LogFilter {
  level?: LogLevel;
  source?: string;
  search?: string;
}

export interface LogItem {
  time: string;
  level: number;
  source: string;
  msg?: string;
  [key: string]: unknown;
}

export interface LogPage {
  logs: LogItem[];
  nextCursor?: string;
}

export const LogLevel = {
  Trace: 10,
  Debug: 20,
  Info: 30,
  Warn: 40,
  Error: 50,
  Fatal: 60,
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
