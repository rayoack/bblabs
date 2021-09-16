import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../src/exceptions/filters/http-exception.filter';

const argumentHostMock: ArgumentsHost = {
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToHttp: jest.fn().mockReturnValue({
    getResponse: jest.fn().mockReturnValue({
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
    }),
    getRequest: jest.fn().mockReturnValue({
      url: '/url',
    }),
  }),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('HttpExceptionFilter', () => {
  describe(`when the filter is called with HttpException`, () => {
    it('should call the method send from response', () => {
      let err: Error;
      try {
        new HttpExceptionFilter().catch(
          new HttpException('', HttpStatus.BAD_GATEWAY),
          argumentHostMock,
        );
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(
        argumentHostMock.switchToHttp().getResponse().status,
      ).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
      expect(
        argumentHostMock.switchToHttp().getResponse().status().json,
      ).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
