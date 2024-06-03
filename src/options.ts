export interface Logger {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  debug(...data: any[]): void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  info(...data: any[]): void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  warn(...data: any[]): void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error(...data: any[]): void;
}

export const defaultLogger: Logger = console;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type OnBeforeRegister = (name: string, service: any) => void;

export type Options = {
  logger?: Logger;
  onBeforeRegister?: OnBeforeRegister;
};
