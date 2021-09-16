import { Logger } from '../../src/logging/logger';

const logLevels = [1, 2, 3, 4, 5];

export const callLoggers = (logger: Logger): void => {
  logger.error('error');
  logger.warn('warn');
  logger.log('log');
  logger.info('info');
  logger.debug('debug');
  logger.trace('trace');
};

export const spyConsole = () => ({
  errorSpy: spyOn(console, 'error'),
  warnSpy: spyOn(console, 'warn'),
  logSpy: spyOn(console, 'log'),
  infoSpy: spyOn(console, 'info'),
  debugSpy: spyOn(console, 'debug'),
  traceSpy: spyOn(console, 'trace'),
});

describe('logger', () => {
  describe('when the process.env.LOGLEVEL is a Enum', () => {
    it('should to get the level from the LogLevelMap', () => {
      process.env.LOGLEVEL = 'INFO';
      callLoggers(new Logger().calculateLogLevel());
    });
  });
  for (let i = 0; i < logLevels.length; i++) {
    const logLevel = logLevels[i];
    describe(`when the logLevel is ${logLevel}`, () => {
      it('should call the console methods', () => {
        const { errorSpy, warnSpy, logSpy, infoSpy, debugSpy, traceSpy } =
          spyConsole();
        process.env.LOGLEVEL = '' + logLevel;
        callLoggers(new Logger().calculateLogLevel());
        if (logLevel >= 5) {
          expect(errorSpy).toHaveBeenCalled();
          expect(warnSpy).not.toHaveBeenCalled();
          expect(logSpy).not.toHaveBeenCalled();
          expect(infoSpy).not.toHaveBeenCalled();
          expect(debugSpy).not.toHaveBeenCalled();
          expect(traceSpy).not.toHaveBeenCalled();
        } else if (logLevel == 4) {
          expect(errorSpy).toHaveBeenCalled();
          expect(warnSpy).toHaveBeenCalled();
          expect(logSpy).not.toHaveBeenCalled();
          expect(infoSpy).not.toHaveBeenCalled();
          expect(debugSpy).not.toHaveBeenCalled();
          expect(traceSpy).not.toHaveBeenCalled();
        } else if (logLevel == 3) {
          expect(errorSpy).toHaveBeenCalled();
          expect(warnSpy).toHaveBeenCalled();
          expect(logSpy).toHaveBeenCalled();
          expect(infoSpy).toHaveBeenCalled();
          expect(debugSpy).not.toHaveBeenCalled();
          expect(traceSpy).not.toHaveBeenCalled();
        } else if (logLevel == 2) {
          expect(errorSpy).toHaveBeenCalled();
          expect(warnSpy).toHaveBeenCalled();
          expect(logSpy).toHaveBeenCalled();
          expect(infoSpy).toHaveBeenCalled();
          expect(debugSpy).toHaveBeenCalled();
          expect(traceSpy).not.toHaveBeenCalled();
        } else {
          expect(errorSpy).toHaveBeenCalled();
          expect(warnSpy).toHaveBeenCalled();
          expect(logSpy).toHaveBeenCalled();
          expect(infoSpy).toHaveBeenCalled();
          expect(debugSpy).toHaveBeenCalled();
          expect(traceSpy).toHaveBeenCalled();
        }
      });
    });
  }
});
