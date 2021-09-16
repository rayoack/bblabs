import {
  mockUserModel,
  saveInterestsMock,
} from '../../__helpers__/user-util.mock';
import { UsersFactory } from '../../../src/domain/users/users.factory';

const connectionMock: any = {
  getRepository: jest.fn().mockReturnValue({
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        getMany: jest.fn(),
      }),
    }),
  }),
};

describe('UsersFactory', () => {
  let usersFactory: UsersFactory;

  beforeAll(() => {
    usersFactory = new UsersFactory(connectionMock);
  });

  describe('when the setInterestsForm method is called', () => {
    describe('and the argument doesnt has professionalsType', () => {
      it('should to ignore this parameter', async () => {
        let err: Error;
        try {
          await usersFactory.setInterestsForm(mockUserModel, saveInterestsMock);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });

    describe('and the body doesnt have fields', () => {
      it('should continue the flow', async () => {
        let err: Error;
        try {
          await usersFactory.setInterestsForm(mockUserModel, {
            ...saveInterestsMock,
            fields: null,
          });
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });
  });
});
