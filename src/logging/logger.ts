import { LoggerService } from '@nestjs/common';

export const LogLevelMap: { [name: string]: number } = {
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  LOG: 3,
  WARN: 4,
  ERROR: 5,
  SILENT: 6,
  OFF: 6,
};

export class Logger implements LoggerService {
  logLevel = 3;

  error(msg: string, ...metadata: unknown[]): void {
    this.logLevel < 6 &&
      console.error(new Date().toISOString(), '- error:', msg, ...metadata);
  }

  warn(msg: string, ...metadata: unknown[]): void {
    this.logLevel < 5 &&
      console.warn(new Date().toISOString(), '- warn:', msg, ...metadata);
  }

  log(msg: string, ...metadata: unknown[]): void {
    this.logLevel < 4 &&
      console.log(new Date().toISOString(), '- log:', msg, ...metadata);
  }

  info(msg: string, ...metadata: unknown[]): void {
    this.logLevel < 4 &&
      console.info(new Date().toISOString(), '- info:', msg, ...metadata);
  }

  debug(msg: string, ...metadata: unknown[]): void {
    this.logLevel < 3 &&
      console.debug(new Date().toISOString(), '- debug:', msg, ...metadata);
  }

  trace(msg: string, ...metadata: unknown[]): void {
    this.logLevel < 2 &&
      console.trace(new Date().toISOString(), '- trace:', msg, ...metadata);
  }

  calculateLogLevel() {
    const logLevel = isNaN(Number(process.env.LOGLEVEL))
      ? (process.env.LOGLEVEL as string)
      : Number(process.env.LOGLEVEL);
    this.logLevel =
      typeof logLevel === 'string'
        ? LogLevelMap[logLevel.toUpperCase()]
        : logLevel;
    return this;
  }
}

const logger = new Logger();
export { logger as logger };
