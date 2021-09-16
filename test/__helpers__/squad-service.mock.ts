import { Repository } from 'typeorm';
import { ProfessionalsType, Squad, Vacancies } from '../../src/domain/entities';
import { SquadToUser } from '../../src/domain/entities/squad-to-user.entity';
import { SquadFactory } from '../../src/domain/squad/squad.factory';
import { UserRepository } from '../../src/domain/users/users.repository';

const professionalsTypeRepository = () => new Repository<ProfessionalsType>();
const deliverablesStagesRepository = () => {
  const repo: any = {
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
  };
  return repo;
};
const squadRepository = () => {
  const repo: any = {
    createQueryBuilder: () => repo,
    innerJoinAndSelect: () => repo,
    leftJoinAndSelect: () => repo,
    where: () => repo,
    select: () => repo,
    leftJoin: () => repo,
    getMany: jest.fn(),
    getOne: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
  };
  return repo;
};
const userRepository = () => new UserRepository();
const squadToUserRepository = () => {
  const repo: any = {
    createQueryBuilder: () => repo,
    innerJoinAndSelect: () => repo,
    where: () => repo,
    findOne: jest.fn(),
    getOne: jest.fn(),
  };
  return repo;
};

const squadFactory = () => new SquadFactory();

const vacanciesMock = (
  squad: Squad,
  professionalType: ProfessionalsType,
  amount: number,
): Vacancies[] => [
  {
    id: 1,
    amount: amount,
    squad,
    professionalType,
  },
];

export {
  professionalsTypeRepository,
  squadRepository,
  userRepository,
  squadFactory,
  vacanciesMock,
  squadToUserRepository,
  deliverablesStagesRepository,
};

export const squadServiceMock = (): any => ({
  createNewSquad: jest.fn(),
  joinTheSquad: jest.fn(),
  findOne: jest.fn(),
  findSquadByUser: jest.fn(),
  findAll: jest.fn(),
  leaveTheSquad: jest.fn(),
  update: jest.fn(),
  uploadFile: jest.fn(),
  sendDeliverables: jest.fn(),
  removeDeliverables: jest.fn(),
});
