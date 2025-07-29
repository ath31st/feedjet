const Logger = {
  getTimestamp(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  },

  resetColor: '\x1b[0m',

  colors: {
    error: '\x1b[31m', // red
    warn: '\x1b[33m', // yellow
    info: '\x1b[36m', // blue
    log: '\x1b[32m', // green
  },

  formatError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.message}\n${error.stack}`;
    }
    return String(error);
  },

  log(...args: unknown[]) {
    const timestamp = this.getTimestamp();
    console.log(
      `${this.colors.log}[${timestamp}] LOG:${this.resetColor}`,
      ...args,
    );
  },

  error(...args: unknown[]) {
    const timestamp = this.getTimestamp();
    const formattedArgs = args.map((arg) =>
      arg instanceof Error ? this.formatError(arg) : arg,
    );
    console.error(
      `${this.colors.error}[${timestamp}] ERROR:${this.resetColor}`,
      ...formattedArgs,
    );
  },

  warn(...args: unknown[]) {
    const timestamp = this.getTimestamp();
    console.warn(
      `${this.colors.warn}[${timestamp}] WARNING:${this.resetColor}`,
      ...args,
    );
  },

  info(...args: unknown[]) {
    const timestamp = this.getTimestamp();
    console.info(
      `${this.colors.info}[${timestamp}] INFO:${this.resetColor}`,
      ...args,
    );
  },
};

export default Logger;
