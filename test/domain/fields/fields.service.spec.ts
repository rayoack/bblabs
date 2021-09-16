import { UnexpectedException } from '../../../src/exceptions/unexpected.exception';
import { FieldsService } from '../../../src/domain/fields/fields.service';
import {
  fieldsListMock,
  fieldsRepository,
} from '../../__helpers__/fields-util.mock';

const unexpectedException = Promise.reject('something-is-wrong');

describe('FieldsService', () => {
  let service: FieldsService;

  beforeAll(() => {
    service = new FieldsService(fieldsRepository);
  });
  describe('when the findAll method is called', () => {
    describe('find all fields', () => {
      it('You must bring all fields', async () => {
        let err: Error;
        const findAllSpy = spyOn(fieldsRepository, 'find').and.returnValue(
          fieldsListMock,
        );
        try {
          await service.findAll();
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findAllSpy).toHaveBeenCalled();
      });
    });

    describe('Error on findAll fields', () => {
      it('should throw an UnexpectedException on find fields', async () => {
        let err: Error;
        spyOn(fieldsRepository, 'find').and.returnValue(unexpectedException);
        try {
          await service.findAll();
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-find-all-fields',
            'fields.service.findAll',
            err,
          ),
        );
      });
    });
  });
});
