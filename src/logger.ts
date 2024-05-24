export interface Logger {
  debug(...data: any[]): void;
  info(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
}

export const defaultLogger: Logger = console;
