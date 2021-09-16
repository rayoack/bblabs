import { UnexpectedException } from '../../../src/exceptions/unexpected.exception';
import { UsersService } from '../../../src/domain/users/users.service';
import {
  bossaboxUserMock,
  userRepository,
  mockUserModel,
  usersFactory,
  saveInterestsMock,
} from '../../__helpers__/user-util.mock';
import { EntityNotFoundException } from '../../../src/exceptions/entity-not-found.exception';

const unexpectedException = Promise.reject('something-is-wrong');
const req = {
  user: bossaboxUserMock,
};

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(() => {
    service = new UsersService(userRepository, usersFactory);
  });
  describe('when the setMemberOfLabsCommunity method is called', () => {
    describe('saving a new user', () => {
      it('should not find a user and save a new one', async () => {
        let err: Error;
        const findSpy = spyOn(userRepository, 'findOne').and.returnValue(req);
        const updateSpy = spyOn(userRepository, 'update').and.returnValue(null);
        try {
          await service.setMemberOfLabsCommunity(req);
        } catch (error) {
          console.debug(error);
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
      });
    });

    describe('updating user', () => {
      it('must find a user and update the data', async () => {
        let err: Error;
        const findSpy = spyOn(userRepository, 'findOne').and.returnValue(
          mockUserModel,
        );
        const updateSpy = spyOn(userRepository, 'update');
        try {
          await service.setMemberOfLabsCommunity(req);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
      });
    });

    describe('updating user', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        spyOn(userRepository, 'findOne').and.returnValue(unexpectedException);
        try {
          await service.setMemberOfLabsCommunity(req);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-active-notfied-user',
            'users.service.setMemberOfLabsCommunity',
            err,
          ),
        );
      });
    });
  });

  describe('when the saveInterests method is called', () => {
    describe('the user was not found.', () => {
      it('should not find a user and return EntityNotFoundException', async () => {
        let err: Error;
        spyOn(userRepository, 'findOne').and.returnValue(null);
        try {
          await service.saveInterests(saveInterestsMock, req.user._id);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'unexpeced-error-save-interests',
            'users.service.saveInterests',
            req.user._id,
          ),
        );
      });
    });

    describe('and the operation was successfully', () => {
      it('save user form data', async () => {
        let err: Error;
        const findSpy = spyOn(userRepository, 'findOne').and.returnValue(
          mockUserModel,
        );
        const updateUserSpy = spyOn(usersFactory, 'setInterestsForm');
        const saveSpy = spyOn(userRepository, 'save');
        try {
          await service.saveInterests(saveInterestsMock, req.user._id);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findSpy).toHaveBeenCalled();
        expect(updateUserSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalled();
      });
    });

    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        spyOn(userRepository, 'findOne').and.returnValue(mockUserModel);
        spyOn(usersFactory, 'setInterestsForm');
        spyOn(userRepository, 'save').and.returnValue(unexpectedException);
        try {
          await service.saveInterests(saveInterestsMock, req.user._id);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-save-interests',
            'users.service.saveInterests',
            err,
          ),
        );
      });
    });
  });

  describe('when the findOne method is called', () => {
    describe('the user was not found.', () => {
      it('should not find a user and create new user', async () => {
        let err: Error;
        const findSpy = spyOn(userRepository, 'findOne').and.returnValue(null);
        const saveSpy = spyOn(userRepository, 'save');
        try {
          await service.findOne(bossaboxUserMock);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalled();
      });
    });

    describe('and the operation was successfully', () => {
      it('find and return user data', async () => {
        let err: Error;
        const findSpy = spyOn(userRepository, 'findOne').and.returnValue(
          mockUserModel,
        );
        try {
          await service.findOne(bossaboxUserMock);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findSpy).toHaveBeenCalled();
      });
    });

    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        spyOn(userRepository, 'findOne').and.returnValue(unexpectedException);
        try {
          await service.findOne(bossaboxUserMock);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-find-one-user',
            'users.service.findOne',
            err,
          ),
        );
      });
    });
  });
});
