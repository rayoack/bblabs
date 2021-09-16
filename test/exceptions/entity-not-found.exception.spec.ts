import { HttpStatus } from '@nestjs/common';
import { EntityNotFoundException } from '../../src/exceptions/entity-not-found.exception';
import { logger } from '../../src/logging/logger';

const exceptionMock = {
  slug: 'slug',
  entityName: 'entityName',
  id: 1,
};

describe('EntityNotFoundException', () => {
  describe('when calling the constuctor', () => {
    it('must create a new class child of HttpBaseException', () => {
      const consoleSpy = spyOn(logger, 'error');
      const exception = new EntityNotFoundException(
        exceptionMock.slug,
        exceptionMock.entityName,
        exceptionMock.id,
      );
      expect(exception).toBeDefined();
      expect(exception.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      expect(exception.getResponse()).toEqual({
        slug: exceptionMock.slug,
        message: `${exceptionMock.entityName} not found (id=${exceptionMock.id})`,
      });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
