import { BadRequestException } from '@nestjs/common';
import { SquadToUser } from '../../../src/domain/entities/squad-to-user.entity';
import { Squad } from '../../../src/domain/entities/squad.entity';
import { SquadService } from '../../../src/domain/squad/squad.service';
import { EntityNotFoundException } from '../../../src/exceptions/entity-not-found.exception';
import { UnexpectedException } from '../../../src/exceptions/unexpected.exception';
import { bossaboxApi } from '../../__helpers__/bossabox-api.service.mock';
import { connection } from '../../__helpers__/connection.mock';
import { constestChallengeServiceMock } from '../../__helpers__/contest-challenge.service.mock';
import { eventEmitter2 } from '../../__helpers__/event-emitter2.mock';
import {
  createAProfessionalType,
  createContestChallenge,
  createSquad,
  createSquadToUser,
} from '../../__helpers__/factories/factories';
import { squadDeliverablesAggregatesMock } from '../../__helpers__/squad-deliverable-aggregate.mock';
import {
  professionalsTypeRepository,
  squadFactory,
  squadRepository,
  squadToUserRepository,
  userRepository,
  vacanciesMock,
  deliverablesStagesRepository,
} from '../../__helpers__/squad-service.mock';
import { mockUserModel } from '../../__helpers__/user-util.mock';
import { deliverableStageMock } from './squad-deliverables.aggregate.spec';

export const fileMock: Express.Multer.File = {
  originalname: 'orginal-name.test',
  filename: 'file-name.test',
  mimetype: 'test/test',
  buffer: Buffer.from('123'),
  fieldname: undefined,
  encoding: undefined,
  size: undefined,
  stream: undefined,
  destination: undefined,
  path: undefined,
};

const parameters = {
  contestChallengeId: 1,
  user: {
    _id: 'b3bdbs023923988sdj3',
    email: 'email@mail.com',
    fullName: 'Testando',
    token: '',
  },
  newSquadDto: {
    description: 'description',
    name: 'name',
    professionalTypeId: 1,
    avatar: 'https://i.pravatar.cc/300',
    slug: 'test/profile/me',
  },
  joinSquadDto: {
    squadId: 1,
    professionalTypeId: 1,
    avatar: 'https://i.pravatar.cc/300',
    slug: 'test/profile/me',
  },
  updateSquadDto: {
    description: 'description',
    name: 'name',
  },
};

const squadDeliverablesMock = squadDeliverablesAggregatesMock();

describe('SquadService', () => {
  const serviceMock = (
    squadRepo = squadRepository(),
    userRepo = userRepository(),
  ) =>
    new SquadService(
      squadRepo,
      squadToUserRepository(),
      professionalsTypeRepository(),
      userRepo,
      deliverablesStagesRepository(),
      connection(),
      constestChallengeServiceMock,
      squadFactory(),
      eventEmitter2,
      bossaboxApi(),
      squadDeliverablesMock,
    );

  describe('when the findOne is called', () => {
    describe('when the squadRepository throw an exception', () => {
      it('should to throw an Unexpected Exception', async () => {
        const squadRepo = squadRepository();
        spyOn(squadRepo, 'createQueryBuilder').and.returnValue(
          Promise.reject(new Error()),
        );
        await expect(serviceMock(squadRepo).findOne('')).rejects.toThrow(
          new UnexpectedException(
            'unexpeced-error-find-one-squad',
            'squad.service.findOne',
            new Error(),
          ),
        );
      });
    });

    describe('when the squadRepository return null', () => {
      it('should to throw an EntityNotFound exception', async () => {
        const squadRepo: any = squadRepository();
        spyOn(
          squadRepo
            .createQueryBuilder()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect(),
          'getOne',
        ).and.returnValue(Promise.resolve(null));
        await expect(serviceMock(squadRepo).findOne('123')).rejects.toThrow(
          new EntityNotFoundException('squad-not-found', 'Squad', '123'),
        );
      });
    });

    describe('when the operation is successfully', () => {
      it('should to return an object', async () => {
        let err: Error;
        const squadRepo = squadRepository();
        spyOn(
          squadRepo
            .createQueryBuilder()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect(),
          'getOne',
        ).and.returnValue(Promise.resolve(new Squad()));
        try {
          serviceMock(squadRepo).findOne('123');
        } catch (error) {
          err = error;
        }
        expect(err).toBeUndefined();
      });
    });
  });

  describe(`when a new squad will be created`, () => {
    describe(`when the professional type is not found`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(createContestChallenge());
        jest.spyOn(professionalsTypeRepo, 'findOne').mockResolvedValue(null);
        const service = new SquadService(
          squadRepository(),
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.createNewSquad(
            parameters.contestChallengeId,
            parameters.user,
            parameters.newSquadDto,
          );
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new BadRequestException(
            `Por favor, escolha outra área de atuação, pois a escolhida não é necessária para este desafio`,
          ),
        );
      });
    });

    describe(`when the user not exists in the database`, () => {
      it(`should to create a new user`, async () => {
        const userRepo = userRepository();
        const contestChallengesProfessionalsType = [
          { professionalsType: createAProfessionalType() },
        ];
        const professionalsTypeRepo = professionalsTypeRepository();
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(
            createContestChallenge(contestChallengesProfessionalsType),
          );
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(
            contestChallengesProfessionalsType[0].professionalsType,
          );
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
        const saveSpy = jest.spyOn(userRepo, 'save');
        const service = new SquadService(
          squadRepository(),
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        try {
          await service.createNewSquad(
            parameters.contestChallengeId,
            parameters.user,
            parameters.newSquadDto,
          );
        } catch (error) {}
        expect(saveSpy).toHaveBeenCalledWith({
          bbox_id: parameters.user._id,
          email: parameters.user.email,
          name: parameters.user.fullName,
          slug: parameters.newSquadDto.slug,
          avatar: parameters.newSquadDto.avatar,
          notified: true,
        });
        try {
          await service.createNewSquad(
            parameters.contestChallengeId,
            parameters.user,
            { ...parameters.newSquadDto, slug: null, avatar: null },
          );
        } catch (error) {}
      });
    });

    describe('when the user exists in the databse', () => {
      describe('but it doesnt have slug or avatar', () => {
        it('should to update the user', async () => {
          const userRepo = userRepository();
          const contestChallengesProfessionalsType = [
            { professionalsType: createAProfessionalType() },
          ];
          const professionalsTypeRepo = professionalsTypeRepository();
          jest
            .spyOn(constestChallengeServiceMock, 'findOne')
            .mockResolvedValue(
              createContestChallenge(contestChallengesProfessionalsType),
            );
          jest
            .spyOn(professionalsTypeRepo, 'findOne')
            .mockResolvedValue(
              contestChallengesProfessionalsType[0].professionalsType,
            );
          jest
            .spyOn(userRepo, 'findOne')
            .mockResolvedValue({ ...mockUserModel, slug: null, avatar: null });
          const saveSpy = jest.spyOn(userRepo, 'save');
          const service = new SquadService(
            squadRepository(),
            squadToUserRepository(),
            professionalsTypeRepo,
            userRepo,
            deliverablesStagesRepository(),
            connection(),
            constestChallengeServiceMock,
            squadFactory(),
            eventEmitter2,
            bossaboxApi(),
            squadDeliverablesMock,
          );
          try {
            await service.createNewSquad(
              parameters.contestChallengeId,
              parameters.user,
              parameters.newSquadDto,
            );
          } catch (error) {}
          expect(saveSpy).toHaveBeenCalledWith({
            bbox_id: mockUserModel.bbox_id,
            email: mockUserModel.email,
            slug: parameters.newSquadDto.slug,
            avatar: parameters.newSquadDto.avatar,
            notified: true,
            id: 1,
            goal_to_participate: null,
            dedication_time: null,
            fields: [],
          });
        });
      });
    });

    describe(`when the user already is a squad participant`, () => {
      it(`should to throw an error explain that the user can't create the squad`, async () => {
        const userRepo = userRepository();
        const squadToUserRepo = squadToUserRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengesProfessionalsType = [
          { professionalsType: createAProfessionalType() },
        ];
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(
            createContestChallenge(contestChallengesProfessionalsType),
          );
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(
            contestChallengesProfessionalsType[0].professionalsType,
          );
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserModel);

        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        spyOn(
          squadToUserRepo.createQueryBuilder().innerJoinAndSelect().where(),
          'getOne',
        ).and.returnValue(squadToUserMock);

        const service = new SquadService(
          squadRepository(),
          squadToUserRepo,
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.createNewSquad(
            parameters.contestChallengeId,
            parameters.user,
            parameters.newSquadDto,
          );
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new BadRequestException('O usuário já participa de uma squad'),
        );
      });
    });

    describe(`when the challenge is not open to squad formation`, () => {
      it(`should to throw an error explain that challenge is not open to squad formation`, async () => {
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengesProfessionalsType = [
          { professionalsType: createAProfessionalType() },
        ];
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(
            createContestChallenge(
              contestChallengesProfessionalsType,
              'in_progess',
            ),
          );
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(
            contestChallengesProfessionalsType[0].professionalsType,
          );
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserModel);

        const service = new SquadService(
          squadRepository(),
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.createNewSquad(
            parameters.contestChallengeId,
            parameters.user,
            parameters.newSquadDto,
          );
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new BadRequestException(
            'Este desafio não está disponível para formações de squads',
          ),
        );
      });
    });

    describe('when trying to find by a user in a squad', () => {
      describe('and an unexpected error happend', () => {
        it('should throw an exception', async () => {
          const userRepo = userRepository();
          const professionalsTypeRepo = professionalsTypeRepository();
          const contestChallengesProfessionalsType = [
            { professionalsType: createAProfessionalType() },
          ];
          jest
            .spyOn(constestChallengeServiceMock, 'findOne')
            .mockResolvedValue(
              createContestChallenge(contestChallengesProfessionalsType),
            );
          jest
            .spyOn(professionalsTypeRepo, 'findOne')
            .mockResolvedValue(createAProfessionalType());
          jest
            .spyOn(userRepo, 'findOne')
            .mockImplementationOnce((conditions) => {
              if (conditions && conditions.bbox_id) {
                return Promise.resolve(mockUserModel);
              } else {
                return Promise.reject(new Error());
              }
            });

          const service = new SquadService(
            squadRepository(),
            squadToUserRepository(),
            professionalsTypeRepo,
            userRepo,
            deliverablesStagesRepository(),
            connection(),
            constestChallengeServiceMock,
            squadFactory(),
            eventEmitter2,
            bossaboxApi(),
            squadDeliverablesMock,
          );
          let err: Error;
          try {
            await service.createNewSquad(
              parameters.contestChallengeId,
              parameters.user,
              parameters.newSquadDto,
            );
          } catch (error) {
            err = error;
          }
          expect(err).toEqual(
            new UnexpectedException(
              `verify-creator-already-participate-in-squad`,
              `SquadService.createNewSquad`,
              new Error(),
            ),
          );
        });
      });
    });

    describe('when the user can create a new squad', () => {
      it('should to create a transaction and save the squad', async () => {
        let err: Error, result: Squad;
        const contestChallengeMock = createContestChallenge([
          { professionalsType: { id: 1 } },
        ]);
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        const conn = connection(squadMock);
        const professionalsTypeRepo = professionalsTypeRepository();
        const userRepo = userRepository();
        const squadFac = squadFactory();
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(professionalTypeMock);
        jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
          if (condition && condition.bbox_id) {
            return Promise.resolve(mockUserModel);
          }
        });
        const service = new SquadService(
          squadRepository(),
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFac,
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );

        try {
          result = await service.createNewSquad(
            parameters.contestChallengeId,
            parameters.user,
            parameters.newSquadDto,
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(result).toEqual(squadMock);
      });
    });

    describe('when an unexpected error happend', () => {
      it('should to call the rollbacktransaction and throw an exception', async () => {
        let err: Error;
        const contestChallengeMock = createContestChallenge([
          { professionalsType: { id: 1 } },
        ]);
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        const conn = connection(squadMock);
        const professionalsTypeRepo = professionalsTypeRepository();
        const userRepo = userRepository();
        const squadFac = squadFactory();
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(professionalTypeMock);
        jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
          if (condition && condition.bbox_id) {
            return Promise.resolve(mockUserModel);
          }
        });
        const squadToUserRepo = squadToUserRepository();
        spyOn(
          squadToUserRepo.createQueryBuilder().innerJoinAndSelect().where(),
          'getOne',
        ).and.returnValue(null);
        const service = new SquadService(
          squadRepository(),
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFac,
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );

        jest
          .spyOn(conn.createQueryRunner().manager, 'save')
          .mockRejectedValue(new Error());

        try {
          await service.createNewSquad(
            parameters.contestChallengeId,
            parameters.user,
            parameters.newSquadDto,
          );
        } catch (error) {
          err = error;
        }
        expect(conn.createQueryRunner().rollbackTransaction).toHaveBeenCalled();
        expect(err).toEqual(
          new UnexpectedException(
            `unexpected-error-create-new-squad`,
            `SquadService.createNewSquad`,
            new Error(),
          ),
        );
      });
    });
  });

  describe(`when user join a squad`, () => {
    describe('findProfessionalType', () => {
      const squadFac = squadFactory();
      const userRepo = userRepository();
      const professionalsTypeRepo = professionalsTypeRepository();
      const contestChallengeMock = createContestChallenge();
      const professionalTypeMock = createAProfessionalType();
      const squadToUserMock = createSquadToUser(
        mockUserModel,
        professionalTypeMock,
      );
      const squadMock = createSquad(
        parameters.newSquadDto,
        contestChallengeMock,
        mockUserModel,
        squadToUserMock,
      );
      beforeEach(() => {
        squadMock.vacancies = vacanciesMock(
          squadMock,
          { ...professionalTypeMock, id: 1 },
          1,
        );
        jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
          if (condition && condition.bbox_id) {
            return Promise.resolve(mockUserModel);
          }
        });
      });

      describe('when the professional type is not found', () => {
        it('should to throw an exception', async () => {
          let err: Error;
          const squadRepo = squadRepository();
          spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          ).and.returnValue({
            contestChallengeId: 1,
          });
          spyOn(constestChallengeServiceMock, 'findOne').and.returnValue({
            status: 'squad_formation',
          });
          jest
            .spyOn(professionalsTypeRepo, 'findOne')
            .mockRejectedValue(new Error());
          const service = new SquadService(
            squadRepo,
            squadToUserRepository(),
            professionalsTypeRepo,
            userRepo,
            deliverablesStagesRepository(),
            connection(null, squadMock),
            constestChallengeServiceMock,
            squadFac,
            eventEmitter2,
            bossaboxApi(),
            squadDeliverablesMock,
          );
          try {
            await service.joinTheSquad(
              parameters.joinSquadDto,
              parameters.user,
            );
          } catch (error) {
            err = error;
          }
          expect(err).toEqual(
            new UnexpectedException(
              `find-professional-type-by-id`,
              `SquadService.createNewSquad`,
              new Error(),
            ),
          );
        });
      });

      describe('when an unexpected error happend trying to find a professional type', () => {
        it('should to throw an exception', async () => {
          let err: Error;
          const squadRepo = squadRepository();
          spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          ).and.returnValue({
            contestChallengeId: 1,
          });
          spyOn(constestChallengeServiceMock, 'findOne').and.returnValue({
            status: 'squad_formation',
          });
          jest.spyOn(professionalsTypeRepo, 'findOne').mockResolvedValue(null);
          const service = new SquadService(
            squadRepo,
            squadToUserRepository(),
            professionalsTypeRepo,
            userRepo,
            deliverablesStagesRepository(),
            connection(null, squadMock),
            constestChallengeServiceMock,
            squadFac,
            eventEmitter2,
            bossaboxApi(),
            squadDeliverablesMock,
          );
          try {
            await service.joinTheSquad(
              parameters.joinSquadDto,
              parameters.user,
            );
          } catch (error) {
            err = error;
          }
          expect(err).toEqual(
            new EntityNotFoundException(
              `find-professional-type-by-id`,
              `ProfessionalType`,
              parameters.joinSquadDto.professionalTypeId,
            ),
          );
        });
      });
    });

    describe(`when the user not exists in the database`, () => {
      it(`should user have join a squad`, async () => {
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();

        jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
        const saveSpy = jest.spyOn(userRepo, 'save');

        const service = new SquadService(
          squadRepository(),
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        try {
          await service.joinTheSquad(parameters.joinSquadDto, parameters.user);
        } catch (error) {}
        expect(saveSpy).toHaveBeenCalledWith({
          bbox_id: parameters.user._id,
          email: parameters.user.email,
          name: parameters.user.fullName,
          slug: parameters.newSquadDto.slug,
          avatar: parameters.newSquadDto.avatar,
          notified: true,
        });
      });
    });

    describe(`when the user already is a squad participant`, () => {
      it(`should to throw an error explain that the user can't join a squad`, async () => {
        let err: Error;
        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        professionalTypeMock.id = 1;
        squadMock.vacancies = vacanciesMock(squadMock, professionalTypeMock, 1);
        const squadFac = squadFactory();
        const squadToUserRepo = squadToUserRepository();
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const squadRepo = squadRepository();

        jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
          if (condition && condition.bbox_id) {
            return Promise.resolve(mockUserModel);
          }
        });
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(professionalTypeMock);

        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        spyOn(
          squadToUserRepo.createQueryBuilder().innerJoinAndSelect().where(),
          'getOne',
        ).and.returnValue(squadToUserMock);

        const service = new SquadService(
          squadRepo,
          squadToUserRepo,
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(null, squadMock),
          constestChallengeServiceMock,
          squadFac,
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );

        try {
          await service.joinTheSquad(parameters.joinSquadDto, parameters.user);
        } catch (error) {
          err = error;
        }

        expect(err).toEqual(
          new BadRequestException('O usuário já participa de uma squad'),
        );
      });
    });

    describe('when the vacancy is no longer available', () => {
      it('should to throw an error explaining that the vacancy is already filled', async () => {
        let err: Error;
        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        professionalTypeMock.id = 1;
        squadMock.vacancies = vacanciesMock(squadMock, professionalTypeMock, 0);
        const squadFac = squadFactory();
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const squadRepo = squadRepository();
        jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
          if (condition && condition.bbox_id) {
            return Promise.resolve(mockUserModel);
          }
        });
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(professionalTypeMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(null, squadMock),
          constestChallengeServiceMock,
          squadFac,
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );

        try {
          await service.joinTheSquad(parameters.joinSquadDto, parameters.user);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new BadRequestException('Essa vaga já foi preenchida'),
        );
      });
    });

    describe('when the user can join a squad', () => {
      const contestChallengeMock = createContestChallenge();
      const professionalTypeMock = createAProfessionalType();
      const squadToUserMock = createSquadToUser(
        mockUserModel,
        professionalTypeMock,
      );
      const squadMock = createSquad(
        parameters.newSquadDto,
        contestChallengeMock,
        mockUserModel,
        squadToUserMock,
      );
      professionalTypeMock.id = 1;
      squadMock.vacancies = vacanciesMock(squadMock, professionalTypeMock, 1);
      const squadFac = squadFactory();
      const userRepo = userRepository();
      const professionalsTypeRepo = professionalsTypeRepository();
      const squadRepo = squadRepository();

      jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
        if (condition && condition.bbox_id) {
          return Promise.resolve(mockUserModel);
        }
      });
      jest
        .spyOn(
          squadRepo
            .createQueryBuilder()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect()
            .leftJoinAndSelect(),
          'getOne',
        )
        .mockResolvedValue(squadMock);
      jest
        .spyOn(professionalsTypeRepo, 'findOne')
        .mockResolvedValue(professionalTypeMock);

      const conn = connection(null, squadMock);

      it('should to create a transaction and join user a squad', async () => {
        let err: Error;
        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        professionalTypeMock.id = 1;
        squadMock.vacancies = vacanciesMock(squadMock, professionalTypeMock, 1);
        const squadFac = squadFactory();
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const squadRepo = squadRepository();

        jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
          if (condition && condition.bbox_id) {
            return Promise.resolve(mockUserModel);
          }
        });
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(professionalsTypeRepo, 'findOne')
          .mockResolvedValue(professionalTypeMock);

        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(null, squadMock),
          constestChallengeServiceMock,
          squadFac,
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );

        try {
          await service.joinTheSquad(parameters.joinSquadDto, parameters.user);
        } catch (error) {
          err = error;
        }

        expect(err).not.toBeDefined();
      });
      describe('when an error happend inside the transaction', () => {
        it('must to call the rollaback and throw an error', async () => {
          let err: Error;
          const squadRepo = squadRepository();
          jest.spyOn(userRepo, 'findOne').mockImplementation((condition) => {
            if (condition && condition.bbox_id) {
              return Promise.resolve(mockUserModel);
            }
          });
          jest.spyOn(squadFac, 'setNewSquadToUser').mockImplementation(() => {
            throw new Error();
          });
          const rollback = jest.spyOn(
            conn.createQueryRunner(),
            'rollbackTransaction',
          );
          jest
            .spyOn(
              squadRepo
                .createQueryBuilder()
                .leftJoinAndSelect()
                .leftJoinAndSelect()
                .leftJoinAndSelect()
                .leftJoinAndSelect()
                .leftJoinAndSelect()
                .leftJoinAndSelect(),
              'getOne',
            )
            .mockResolvedValue(squadMock);

          jest
            .spyOn(constestChallengeServiceMock, 'findOne')
            .mockResolvedValue(contestChallengeMock);
          try {
            const service = new SquadService(
              squadRepo,
              squadToUserRepository(),
              professionalsTypeRepo,
              userRepo,
              deliverablesStagesRepository(),
              conn,
              constestChallengeServiceMock,
              squadFac,
              eventEmitter2,
              bossaboxApi(),
              squadDeliverablesMock,
            );

            await service.joinTheSquad(
              parameters.joinSquadDto,
              parameters.user,
            );
          } catch (error) {
            err = error;
          }
          expect(rollback).toHaveBeenCalled();
          expect(err).toEqual(
            new UnexpectedException(
              `unexpected-error-join-the-squad`,
              `SquadService.joinTheSquad`,
              new Error(),
            ),
          );
        });
      });
    });
  });

  describe(`when user findOne a squad`, () => {
    describe(`when find a squad`, () => {
      it(`should to return squad data`, async () => {
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const conn = connection();

        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        professionalTypeMock.id = 1;
        squadMock.vacancies = vacanciesMock(squadMock, professionalTypeMock, 0);
        const squadRepo = squadRepository();

        const findOneSpy = jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.findOne(1);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findOneSpy).toHaveBeenCalled();
      });
    });
  });

  describe(`when findAll method is called`, () => {
    describe(`when an unexpected error happend trying to find a squad`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const conn = connection();
        const squadRepo = squadRepository();
        spyOn(squadRepo, 'createQueryBuilder').and.returnValue(
          Promise.reject(new Error()),
        );
        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.findAll(1, parameters.user);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            `unexpeced-error-find-all-squad`,
            `squad.service.findAll`,
            new Error(),
          ),
        );
      });
    });

    describe(`when find all squads`, () => {
      it(`should to return squad data`, async () => {
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const conn = connection();

        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        professionalTypeMock.id = 1;
        squadMock.vacancies = vacanciesMock(squadMock, professionalTypeMock, 0);
        const squadRepo = squadRepository();
        const findAllSpy = spyOn(
          squadRepo,
          'createQueryBuilder',
        ).and.returnValue({
          where: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue({
                leftJoin: jest.fn().mockReturnValue({
                  leftJoin: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                      leftJoin: jest.fn().mockReturnValue({
                        getMany: jest.fn().mockReturnValue([squadMock]),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        });
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserModel);
        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.findAll(1, parameters.user);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findAllSpy).toHaveBeenCalled();
      });
    });
  });

  describe(`when user leave the squad`, () => {
    describe(`when the squad is not found`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const squadRepo = squadRepository();
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(null);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.leaveTheSquad(1, parameters.user);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'squad-not-found-user-leave-the-squad',
            `Squad`,
            1,
          ),
        );
      });
    });

    describe(`when the challenge does not allow members to leave`, () => {
      it(`should to throw an exception`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengeMock = createContestChallenge([], 'finished');
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );

        const squadRepo = squadRepository();
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.leaveTheSquad(1, parameters.user);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new BadRequestException(
            'Não é possivel sair de uma squad na atual etapa do desafio.',
          ),
        );
      });
    });

    describe(`when can't find the user`, () => {
      it(`should to throw an exception`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const squadRepo = squadRepository();
        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.leaveTheSquad(1, parameters.user);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'user-not-found-leave-the-squad',
            'User',
            parameters.user._id,
          ),
        );
      });
    });

    describe(`when the user is not part of the squad`, () => {
      it(`should to throw an exception`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const squadRepo = squadRepository();
        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        mockUserModel.bbox_id = parameters.user._id;

        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserModel);

        jest
          .spyOn(conn.createQueryRunner().manager, 'find')
          .mockResolvedValue([]);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.leaveTheSquad(1, parameters.user);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new BadRequestException('Este usuário não participa desta squad.'),
        );
      });
    });

    describe(`when the user is removed from the squad but the vacancy is not available again`, () => {
      it(`should to remove user from squad`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengeMock = createContestChallenge([], 'in_progress');
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        mockUserModel.bbox_id = parameters.user._id;

        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserModel);

        jest
          .spyOn(conn.createQueryRunner().manager, 'find')
          .mockResolvedValue([squadToUserMock, squadToUserMock]);

        const deletSpy = jest.spyOn(conn.createQueryRunner().manager, 'delete');

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        try {
          await service.leaveTheSquad(1, parameters.user);
        } catch (error) {}
        expect(deletSpy).toBeCalledWith(
          SquadToUser,
          squadToUserMock.squadToUser,
        );
      });
    });
    describe(`when the user is removed from the squad but the vacancy is available again`, () => {
      it(`should to remove user from squad`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengeMock = createContestChallenge();
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        mockUserModel.bbox_id = parameters.user._id;

        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserModel);

        jest
          .spyOn(conn.createQueryRunner().manager, 'find')
          .mockResolvedValue([squadToUserMock, squadToUserMock]);

        const deletSpy = jest.spyOn(conn.createQueryRunner().manager, 'delete');
        const incrementSpy = jest.spyOn(
          conn.createQueryRunner().manager,
          'increment',
        );

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        try {
          await service.leaveTheSquad(1, parameters.user);
        } catch (error) {}
        expect(deletSpy).toBeCalledWith(
          SquadToUser,
          squadToUserMock.squadToUser,
        );
        expect(incrementSpy).toBeCalled();
      });
    });
  });

  describe(`when user update the squad`, () => {
    describe(`when the challenge does not allow update squad`, () => {
      it(`should to throw an exception`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengeMock = createContestChallenge([], 'finished');
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.update(1, parameters.updateSquadDto);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new BadRequestException(
            'Não é possivel alterar uma squad na atual etapa do desafio.',
          ),
        );
      });
    });
    describe(`when the challenge does not allow update squad`, () => {
      it(`should to throw an exception`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengeMock = createContestChallenge([], 'finished');
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockRejectedValue(new Error());

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        let err: Error;
        try {
          await service.update(1, parameters.updateSquadDto);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-update-squad',
            'squad.service.update',
            new Error(),
          ),
        );
      });
    });
    describe(`when the squad is updated`, () => {
      it(`should to update squad`, async () => {
        const conn = connection();
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const professionalsTypeRepo = professionalsTypeRepository();
        const contestChallengeMock = createContestChallenge([], 'in_progress');
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );

        const squadMock = createSquad(
          parameters.newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );
        jest
          .spyOn(
            squadRepo
              .createQueryBuilder()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect()
              .leftJoinAndSelect(),
            'getOne',
          )
          .mockResolvedValue(squadMock);
        jest
          .spyOn(constestChallengeServiceMock, 'findOne')
          .mockResolvedValue(contestChallengeMock);

        squadMock.id = '1';

        const updateSpy = jest.spyOn(
          conn.createQueryRunner().manager,
          'update',
        );

        const service = new SquadService(
          squadRepo,
          squadToUserRepository(),
          professionalsTypeRepo,
          userRepo,
          deliverablesStagesRepository(),
          conn,
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
        try {
          await service.update(1, parameters.updateSquadDto);
        } catch (error) {}
        expect(updateSpy).toBeCalledWith(Squad, '1', parameters.updateSquadDto);
      });
    });
  });

  describe('when the squad upload file', () => {
    describe('when some parameter are null', () => {
      let service: SquadService;
      beforeEach(() => {
        service = new SquadService(
          squadRepository(),
          squadToUserRepository(),
          professionalsTypeRepository(),
          userRepository(),
          deliverablesStagesRepository(),
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
      });
      describe('when the squadid is null', () => {
        it('should to throw an exception', async () => {
          await expect(service.uploadFile(null, null, null)).rejects.toThrow(
            'O id da squad é obrigatório',
          );
          await expect(
            service.uploadFile('123123', null, null),
          ).rejects.toThrow(
            new BadRequestException(
              'Os entregáveis precisam pelo menos de um arquivo em anexo',
            ),
          );
          await expect(
            service.uploadFile('123123', null, fileMock),
          ).rejects.toThrow(
            new BadRequestException('Os entregáveis da squad são obrigatórios'),
          );
          const deliverables: any = {
            stageId: null,
            attachments: [],
          };
          await expect(
            service.uploadFile('123123', deliverables, fileMock),
          ).rejects.toThrow(
            new BadRequestException('Os entregáveis da squad são obrigatórios'),
          );
          await expect(
            service.uploadFile(
              '123123',
              {
                ...deliverables,
                stageId: 1,
                attachments: null,
              },
              fileMock,
            ),
          ).rejects.toThrow(
            new BadRequestException(
              'Os entregáveis precisam pelo menos de um anexo (link ou arquivo)',
            ),
          );
          await expect(
            service.uploadFile(
              '123123',
              {
                ...deliverables,
                stageId: 1,
                attachments: [],
              },
              fileMock,
            ),
          ).rejects.toThrow(
            new BadRequestException(
              'Os entregáveis precisam pelo menos de um anexo (link ou arquivo)',
            ),
          );
        });
      });
    });

    describe('when the findOneOrFail is called', () => {
      const deliverablesStagesRepo = deliverablesStagesRepository();
      const service = (squadRep = squadRepository()) =>
        new SquadService(
          squadRep,
          squadToUserRepository(),
          professionalsTypeRepository(),
          userRepository(),
          deliverablesStagesRepo,
          connection(),
          constestChallengeServiceMock,
          squadFactory(),
          eventEmitter2,
          bossaboxApi(),
          squadDeliverablesMock,
        );
      describe('when everything is ok', () => {
        it('should to call the upoadFile from squadDeliverableAggregate', async () => {
          const squadMock = new Squad();
          squadMock.id = '123123123';
          const squadRepo = squadRepository();
          const findOneOrFailSpy = jest
            .spyOn(squadRepo, 'findOneOrFail')
            .mockResolvedValue(squadMock);
          const findDeliverablesStagesSpy = jest
            .spyOn(deliverablesStagesRepo, 'findOne')
            .mockResolvedValue(deliverableStageMock('Exploração'));
          const getBucketToAttachmentsSpy = jest.spyOn(
            squadDeliverablesMock,
            'getBucketToAttachments',
          );
          const uploadFileSpy = jest.spyOn(squadDeliverablesMock, 'uploadFile');
          let err: Error;
          try {
            await service(squadRepo).uploadFile(
              '123123',
              {
                stageId: 1,
                attachments: [
                  {
                    type: 'type',
                    name: 'name',
                    url: 'url',
                  },
                ],
              },
              fileMock,
            );
          } catch (error) {
            err = error;
          }
          expect(err).not.toBeDefined();
          expect(findOneOrFailSpy).toHaveBeenCalled();
          expect(findDeliverablesStagesSpy).toHaveBeenCalled();
          expect(getBucketToAttachmentsSpy).toHaveBeenCalled();
          expect(uploadFileSpy).toHaveBeenCalled();
        });
      });

      describe('when throw an error', () => {
        it('should to capture the error', async () => {
          const squadRepo = squadRepository();
          jest.spyOn(squadRepo, 'findOneOrFail').mockRejectedValue(new Error());
          let err: Error;
          try {
            await service(squadRepo).uploadFile(
              '123123',
              {
                stageId: 1,
                attachments: [
                  {
                    type: 'type',
                    name: 'name',
                    url: 'url',
                  },
                ],
              },
              fileMock,
            );
          } catch (error) {
            err = error;
          }
          expect(err).toEqual(
            new UnexpectedException(
              'upload-deliverables-files-squad',
              'SquadService.uploadFile',
              new Error(),
            ),
          );
        });
      });
    });
  });

  describe('when the removeDeliverables is called', () => {
    const deliverablesStagesRepo = deliverablesStagesRepository();
    const serviceSquadMock = (squadRepo = squadRepository()) =>
      new SquadService(
        squadRepo,
        squadToUserRepository(),
        professionalsTypeRepository(),
        userRepository(),
        deliverablesStagesRepo,
        connection(),
        constestChallengeServiceMock,
        squadFactory(),
        eventEmitter2,
        bossaboxApi(),
        squadDeliverablesMock,
      );
    describe('when something is wrong', () => {
      it('should to throw an BadRequestException', async () => {
        await expect(
          serviceSquadMock().removeDeliverables(null, 1),
        ).rejects.toThrow(
          new BadRequestException('O id da squad é obrigatório'),
        );
      });
    });

    describe('when the removeDeliverables throw an exception', () => {
      it('should capture the exception', async () => {
        const squadRepo = squadRepository();
        jest.spyOn(squadRepo, 'findOneOrFail').mockRejectedValue(new Error());
        await expect(
          serviceSquadMock(squadRepo).removeDeliverables('23', 1),
        ).rejects.toThrow(
          new UnexpectedException(
            'remove-squad-deliverables-attachments',
            'SquadService.removeDeliverables',
            new Error(),
          ),
        );
      });
    });

    describe('when the removeDeliverables is successfull', () => {
      it('should return a array of deliverables deleted', async () => {
        const squadRepo = squadRepository();
        const removeDeliverablesSpy = jest.spyOn(
          squadDeliverablesMock,
          'removeDeliverables',
        );
        jest.spyOn(squadRepo, 'findOneOrFail').mockResolvedValue(new Squad());
        jest
          .spyOn(deliverablesStagesRepo, 'findOneOrFail')
          .mockResolvedValue(deliverableStageMock('Exploração'));
        let err: Error;
        try {
          await serviceSquadMock(squadRepo).removeDeliverables('23', 1);
        } catch (error) {
          err = error;
        }

        expect(err).toBeUndefined();
        expect(removeDeliverablesSpy).toHaveBeenCalledWith(
          new Squad(),
          deliverableStageMock('Exploração'),
        );
      });
    });
  });

  describe('when the sendDeliverables is called', () => {
    describe('when something is wrong', () => {
      const service = serviceMock();
      it('should to throw an exeception', async () => {
        await expect(
          service.sendDeliverables(null, null, null),
        ).rejects.toThrow(
          new BadRequestException('O id da squad é obrigatório'),
        );
        await expect(
          service.sendDeliverables('223', null, null),
        ).rejects.toThrow(
          new BadRequestException('O id do criador é obrigatório'),
        );
        await expect(
          service.sendDeliverables(
            '223',
            { _id: null, email: '', fullName: '', token: '' },
            null,
          ),
        ).rejects.toThrow(
          new BadRequestException('O id do criador é obrigatório'),
        );
        await expect(
          service.sendDeliverables(
            '223',
            { _id: '23123', email: '', fullName: '', token: '' },
            null,
          ),
        ).rejects.toThrow(
          new BadRequestException('Os entregáveis da squad são obrigatórios'),
        );
        await expect(
          service.sendDeliverables(
            '223',
            { _id: '23123', email: '', fullName: '', token: '' },
            { stageId: null, attachments: [] },
          ),
        ).rejects.toThrow(
          new BadRequestException('Os entregáveis da squad são obrigatórios'),
        );
        await expect(
          service.sendDeliverables(
            '223',
            { _id: '23123', email: '', fullName: '', token: '' },
            {
              stageId: 1,
              attachments: null,
            },
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Os entregáveis precisam pelo menos de um anexo (link ou arquivo)',
          ),
        );
        await expect(
          service.sendDeliverables(
            '223',
            { _id: '23123', email: '', fullName: '', token: '' },
            {
              stageId: 1,
              attachments: [],
            },
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Os entregáveis precisam pelo menos de um anexo (link ou arquivo)',
          ),
        );
      });
    });

    describe('when the everything is fine', () => {
      describe('when save the deliverables is successful', () => {
        it('should to call the findOneOrFail and save', async () => {
          const userRepo = userRepository();
          const findOneUserSpy = jest
            .spyOn(userRepo, 'findOneOrFail')
            .mockResolvedValue(mockUserModel);
          const squadRepo = squadRepository();
          const findOneSquadSpy = jest
            .spyOn(squadRepo, 'findOneOrFail')
            .mockResolvedValue(new Squad());
          const saveSpy = jest.spyOn(squadDeliverablesMock, 'save');

          let err: Error;
          try {
            const service = serviceMock(squadRepo, userRepo);
            await service.sendDeliverables(
              '223',
              { _id: '23123', email: '', fullName: '', token: '' },
              {
                stageId: 1,
                attachments: [{ name: 'name', type: 'type', url: 'url' }],
              },
            );
          } catch (error) {
            err = error;
          }
          expect(err).toBeUndefined();
          expect(findOneUserSpy).toHaveBeenCalled();
          expect(findOneSquadSpy).toHaveBeenCalled();
          expect(saveSpy).toHaveBeenCalled();
        });
      });
      describe('when findOneOrFail throw an Exception', () => {
        it('should to capture the exception', async () => {
          const squadRepo = squadRepository();
          jest.spyOn(squadRepo, 'findOneOrFail').mockRejectedValue(new Error());
          await expect(
            serviceMock(squadRepo).sendDeliverables(
              '223',
              { _id: '23123', email: '', fullName: '', token: '' },
              {
                stageId: 1,
                attachments: [{ name: 'name', type: 'type', url: 'url' }],
              },
            ),
          ).rejects.toThrow(
            new UnexpectedException(
              'send-squad-deliverables-attachments',
              'SquadService.sendDeliverables',
              new Error(),
            ),
          );
        });
      });
    });
  });
});
