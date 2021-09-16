import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import {
  EntityNotFoundError,
  NoConnectionForRepositoryError,
  NoConnectionOptionError,
  PersistedEntityNotFoundError,
  QueryFailedError,
} from 'typeorm';
import { DatabaseExceptionFilter } from '../../../src/exceptions/filters/database-exception.filter';

const databaseErrors = [
  EntityNotFoundError,
  QueryFailedError,
  NoConnectionForRepositoryError,
  PersistedEntityNotFoundError,
  NoConnectionOptionError,
];

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

describe('DatabaseExceptionFilter', () => {
  for (let i = 0; i < databaseErrors.length; i++) {
    const databaseError = databaseErrors[i];
    describe(`when the filter is called with ${databaseError.name}`, () => {
      it('should call the method send from response', () => {
        let err: Error;
        try {
          new DatabaseExceptionFilter().catch(
            new (databaseError as any)('', '', ''),
            argumentHostMock,
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(
          argumentHostMock.switchToHttp().getResponse().status,
        ).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(
          argumentHostMock.switchToHttp().getResponse().status().json,
        ).toHaveBeenCalledWith(expect.any(Object));
      });
    });
  }
});
