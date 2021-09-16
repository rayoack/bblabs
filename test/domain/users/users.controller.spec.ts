import { UsersController } from '../../../src/domain/users/users.controller';
// import { Req } from '@nestjs/common';
import {
  usersServiceMock,
  bossaboxUserMock,
  saveInterestsMock,
} from '../../__helpers__/user-util.mock';

const req = {
  user: bossaboxUserMock,
};

describe('UsersController', () => {
  describe('when the setMemberOfLabsCommunity method is called', () => {
    it('should to call the setMemberOfLabsCommunity method from UsersService', async () => {
      const changeNotified = spyOn(
        usersServiceMock,
        'setMemberOfLabsCommunity',
      );
      let err: Error;
      try {
        await new UsersController(usersServiceMock).setMemberOfLabsCommunity(
          req,
        );
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(changeNotified).toHaveBeenCalledWith(req);
    });
  });

  describe('when the saveInterests method is called', () => {
    it('should to call the saveInterests method from UsersService', async () => {
      const spySaveInterests = spyOn(usersServiceMock, 'saveInterests');
      let err: Error;
      try {
        await new UsersController(usersServiceMock).saveInterests(
          saveInterestsMock,
          req,
        );
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(spySaveInterests).toHaveBeenCalledWith(
        saveInterestsMock,
        req.user._id,
      );
    });
  });

  describe('when the findOne method is called', () => {
    it('should to call the findOne method from UsersService', async () => {
      const spyFindOne = spyOn(usersServiceMock, 'findOne');
      let err: Error;
      try {
        await new UsersController(usersServiceMock).findOne(req);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(spyFindOne).toHaveBeenCalledWith(req.user);
    });
  });
});
