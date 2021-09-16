import { HttpStatus } from '@nestjs/common';
import { UnexpectedException } from '../../src/exceptions/unexpected.exception';
import { logger } from '../../src/logging/logger';

const exceptionMock = {
  slug: 'slug',
  operation: 'operation',
  error: new Error(),
};

describe('UnexpectedException', () => {
  describe('when calling the constuctor', () => {
    it('must create a new class child of HttpBaseException', () => {
      const consoleSpy = spyOn(logger, 'error');
      const exception = new UnexpectedException(
        exceptionMock.slug,
        exceptionMock.operation,
        exceptionMock.error,
      );
      expect(exception).toBeDefined();
      expect(exception.getStatus()).toEqual(HttpStatus.SERVICE_UNAVAILABLE);
      expect(exception.getResponse()).toEqual({
        slug: exceptionMock.slug,
        message: `Unexpected error in "${exceptionMock.operation}", please try again later`,
        error: exceptionMock.error,
      });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
