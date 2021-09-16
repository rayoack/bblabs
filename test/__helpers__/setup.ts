const overrideLogging: any = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: console.debug,
  trace: jest.fn(),
};
global.console = overrideLogging;
