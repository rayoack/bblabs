import { Users } from '../../src/domain/entities/user.entity';
import { UserRepository } from '../../src/domain/users/users.repository';

const connection = {};

export const userRepository: UserRepository = new UserRepository();
export const usersFactory: any = {
  connection,
  setInterestsForm: jest.fn(),
};

export const mockAddUserParams: any = {
  bbox_id: '6086b5a6f1f34900089aa195',
  email: 'user1@gmail.com',
};

export const mockUserModel: Users = {
  id: 1,
  notified: true,
  goal_to_participate: null,
  dedication_time: null,
  fields: [],
  slug: 'slug',
  avatar: 'avatar',
  ...mockAddUserParams,
};

export const usersServiceMock: any = {
  userRepository,
  setMemberOfLabsCommunity: jest.fn(),
  saveInterests: jest.fn(),
  findOne: jest.fn(),
};

export const bossaboxUserMock: any = {
  _id: '6086b5a6f1f34900089aa195',
  fullName: 'Test Da Silva',
  email: 'test01@fulano.com',
  iat: 1619447038,
  exp: 1620656638,
};

export const saveInterestsMock: any = {
  dedication_time: 'Até 1 mês',
  goal_to_participate: 'Networking',
  fields: [1, 2],
};
