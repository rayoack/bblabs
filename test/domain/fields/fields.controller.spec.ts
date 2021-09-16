import { fieldsServiceMock } from '../../__helpers__/fields-util.mock';
import { FieldsController } from '../../../src/domain/fields/fields.controller';

describe('FieldsController', () => {
  describe('FieldsController', () => {
    describe('when the findAll method is called', () => {
      it('should to call the findAll method from UsersService', async () => {
        const spyFindAll = spyOn(fieldsServiceMock, 'findAll');
        let err: Error;
        try {
          await new FieldsController(fieldsServiceMock).findAll();
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(spyFindAll).toHaveBeenCalledWith();
      });
    });
  });
});
