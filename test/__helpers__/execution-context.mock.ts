import { ExecutionContext } from '@nestjs/common';

export const executionContextMock = (headers: any): ExecutionContext => ({
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getType: jest.fn(),
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers,
    }),
  }),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
});
