jest.mock('nestjs-typeorm-paginate');
import { BadRequestException } from '@nestjs/common';
import { paginate } from 'nestjs-typeorm-paginate';
import { createContestChallenge } from '../../__helpers__/factories/contest-challenge.factory';
import { createAProfessionalType } from '../../__helpers__/factories/professionals-type.factory';
import {
  createSquad,
  createSquadToUser,
} from '../../__helpers__/factories/squad.factory';
import { voteServiceMock } from '../../__helpers__/vote-service.mock';
import { mocked } from 'ts-jest/utils';
import { ContestChallengesService } from '../../../src/domain/contest-challenges/contest-challenges.service';
import { EntityNotFoundException } from '../../../src/exceptions/entity-not-found.exception';
import { UnexpectedException } from '../../../src/exceptions/unexpected.exception';
import { connection } from '../../__helpers__/connection.mock';
import {
  contestChallengeDto,
  contestChallengesFactory,
  contestChallengesRepository,
  createChallengeMock,
  updateContestChallengeDto,
} from '../../__helpers__/contest-challenge.service.mock';
import {
  userRepository,
  mockUserModel,
} from '../../__helpers__/user-util.mock';
import { BossaboxApiService } from '../../../src/integrations/bossabox-api.service';
import { In } from 'typeorm';
import { bossaboxApi } from '../../__helpers__/bossabox-api.service.mock';

const unexpectedException = Promise.reject('something-is-wrong');

const mockedPaginate = mocked(paginate);

const paginateResult = {
  items: [],
  meta: {
    totalItems: 2,
    itemCount: 2,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
  links: {
    first: '/contest-challenges?limit=10',
    previous: '',
    next: '',
    last: '/contest-challenges?page=1&limit=10',
  },
};

const parameters = {
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
};

const conn = connection({
  id: 1,
  ...createChallengeMock,
});

describe('ContestChallengesService', () => {
  let service: ContestChallengesService;
  let bossaboxApiService: BossaboxApiService;
  const voteService = voteServiceMock();

  beforeAll(() => {
    bossaboxApiService = new BossaboxApiService();
    service = new ContestChallengesService(
      conn,
      contestChallengesRepository,
      userRepository,
      contestChallengesFactory,
      bossaboxApiService,
      voteService,
      bossaboxApi(),
    );
  });

  describe('when the create method is called', () => {
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        spyOn(
          contestChallengesFactory,
          'setNewContestChallenge',
        ).and.returnValue(unexpectedException);
        try {
          await service.create(contestChallengeDto());
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpected-error-create-a-challenge',
            'contest-challenges.service.create',
            err,
          ),
        );
      });
    });

    describe('and the operation was successfully', () => {
      it('should return the same entity with an id', async () => {
        let err: Error;
        const setNewContestChallengeSpy = spyOn(
          contestChallengesFactory,
          'setNewContestChallenge',
        );
        const setChallengeProfessionalsTypeSpy = spyOn(
          contestChallengesFactory,
          'setNewContestChallengeProfessionalType',
        );
        try {
          await service.create(contestChallengeDto());
        } catch (error) {
          console.log(error);
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(setNewContestChallengeSpy).toHaveBeenCalled();
        expect(setChallengeProfessionalsTypeSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when the findAll method is called', () => {
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        try {
          mockedPaginate.mockReturnValue(unexpectedException);
          await service.findAll(
            { limit: 10, page: 0 },
            'coming_soon,squad_formation,in_progress',
          );
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-find-all-challenges',
            'contest-challenges.service.findAll',
            err,
          ),
        );
      });
    });
    describe('and the operation was successfully', () => {
      it('should return a Pagination object with an ContestChallenge array', async () => {
        let err: Error;
        mockedPaginate.mockReturnValue(Promise.resolve(paginateResult));
        const options = { limit: 10, page: 0 };
        try {
          await service.findAll(
            options,
            'coming_soon,squad_formation,in_progress',
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(mockedPaginate).toHaveBeenCalledWith(
          expect.any(Object),
          options,
          {
            order: { id: 'ASC' },
            relations: [
              'fields',
              'contestChallengesProfessionalsType',
              'contestChallengesProfessionalsType.professionalsType',
            ],
            where: {
              status: In(['coming_soon', 'squad_formation', 'in_progress']),
            },
          },
        );
      });
    });
  });

  describe('when the findOne method is called', () => {
    describe('and the id parameter is null', () => {
      it('should to find by the open status', async () => {
        let err: Error;
        spyOn(contestChallengesRepository, 'findOne');
        try {
          await service.findOne(null);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'challenge-not-found',
            'ContestChallenges',
            null,
          ),
        );
      });
    });
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        spyOn(contestChallengesRepository, 'findOne').and.returnValue(
          unexpectedException,
        );
        try {
          await service.findOne(1);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-find-one-challenge',
            'contest-challenges.service.findOne',
            err,
          ),
        );
      });
    });
    describe('and the object is not found', () => {
      it('should throw an EntityNotFoundException', async () => {
        let err: Error;
        spyOn(contestChallengesRepository, 'findOne');
        try {
          await service.findOne(1);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'challenge-not-found',
            'ContestChallenges',
            1,
          ),
        );
      });
    });
    describe('and the operation was successfully', () => {
      it('should return a ContestChallenge object', async () => {
        let err: Error;
        const findOne = spyOn(
          contestChallengesRepository,
          'findOne',
        ).and.returnValue(
          Promise.resolve({
            name: 'contest-challenge',
          }),
        );
        try {
          await service.findOne(1);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findOne).toHaveBeenCalledWith(
          { id: 1 },
          {
            relations: [
              'fields',
              'contestChallengesProfessionalsType',
              'contestChallengesProfessionalsType.professionalsType',
              'deliverablesStages',
            ],
          },
        );
      });
    });
  });

  describe('when the countChallengesByStatus method is called', () => {
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;

        spyOn(
          contestChallengesRepository,
          'createQueryBuilder',
        ).and.returnValue({
          select: jest.fn().mockReturnValue({
            groupBy: jest.fn().mockReturnValue({
              getRawMany: jest.fn().mockReturnValue(unexpectedException),
            }),
          }),
        });

        try {
          await service.countChallengesByStatus();
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-count-challenges-by-status',
            'contest-challenges.service.countChallengesByStatus',
            err,
          ),
        );
      });
    });

    describe('and the operation was successfully', () => {
      it('should return a count of status by challenges object', async () => {
        let err: Error;

        const getCountChallengesByStatusSpy = spyOn(
          contestChallengesRepository,
          'createQueryBuilder',
        ).and.returnValue({
          select: jest.fn().mockReturnValue({
            groupBy: jest.fn().mockReturnValue({
              getRawMany: jest.fn().mockReturnValue([]),
            }),
          }),
        });

        try {
          await service.countChallengesByStatus();
        } catch (error) {
          err = error;
          console.debug(err);
        }
        expect(err).not.toBeDefined();
        expect(getCountChallengesByStatusSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when the update method is called', () => {
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        spyOn(service, 'findOne');
        spyOn(contestChallengesFactory, 'updateContestChallenge');
        spyOn(contestChallengesRepository, 'save').and.returnValue(
          unexpectedException,
        );
        try {
          await service.update(1, updateContestChallengeDto());
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-update-challenge',
            'contest-challenges.service.update',
            err,
          ),
        );
      });
    });
    describe('and the operation was successfully', () => {
      it('should return the same ContestChallenge passed as argument', async () => {
        let err: Error;
        const findOneSpy = spyOn(service, 'findOne');
        const updateContestChallengeSpy = spyOn(
          contestChallengesFactory,
          'updateContestChallenge',
        );
        const saveSpy = spyOn(
          contestChallengesRepository,
          'save',
        ).and.returnValue(Promise.resolve(updateContestChallengeDto()));
        try {
          await service.update(1, updateContestChallengeDto());
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findOneSpy).toHaveBeenCalled();
        expect(updateContestChallengeSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when the delete method is called', () => {
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        spyOn(contestChallengesRepository, 'delete').and.returnValue(
          unexpectedException,
        );
        let err: Error;
        try {
          await service.delete(1);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-delete-challenge',
            'contest-challenges.service.delete',
            err,
          ),
        );
      });
    });
    describe('and the object is not found', () => {
      it('should throw an EntityNotFoundException', async () => {
        spyOn(contestChallengesRepository, 'delete');
        let err: Error;
        try {
          await service.delete(1);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'challenge-not-found-delete',
            'ContestChallenges',
            1,
          ),
        );
      });
      it('when the affeced is 0 should throw an EntityNotFoundException', async () => {
        spyOn(contestChallengesRepository, 'delete').and.returnValue(
          Promise.resolve({
            affected: 0,
          }),
        );
        let err: Error;
        try {
          await service.delete(1);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'challenge-not-found-delete',
            'ContestChallenges',
            1,
          ),
        );
      });
    });
    describe('and the operation was successfully', () => {
      it('should return an object with the property affected equals 1', async () => {
        const deleteSpy = spyOn(
          contestChallengesRepository,
          'delete',
        ).and.returnValue(
          Promise.resolve({
            affected: 1,
          }),
        );
        let err: Error;
        try {
          await service.delete(1);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(deleteSpy).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('when the updateStatus is called', () => {
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        spyOn(service, 'findOne').and.returnValue(contestChallengeDto());
        spyOn(contestChallengesRepository, 'save').and.returnValue(
          unexpectedException,
        );
        try {
          await service.updateStatus(1, 'coming_soon');
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-update-status-challenge',
            'contest-challenges.service.updateStatus',
            err,
          ),
        );
      });
    });

    describe('and no contest challenge was found', () => {
      it('should throw an EntityNotFoundException', async () => {
        let err: Error;
        spyOn(service, 'findOne');
        try {
          await service.updateStatus(null, 'status-update');
        } catch (error) {
          err = error;
        }

        expect(err).toEqual(
          new EntityNotFoundException(
            'challenge-not-found-updateStatus',
            'ContestChallenges',
            null,
          ),
        );
      });
    });

    describe('and the status is invalid', () => {
      it('should throw an BadRequestException', async () => {
        let err: Error;
        spyOn(service, 'findOne').and.returnValue(contestChallengeDto());
        try {
          await service.updateStatus(1, 'status-update');
        } catch (error) {
          err = error;
        }

        expect(err).toEqual(
          new BadRequestException(
            'bad-request-update-status-challenge',
            "Invalid challenge's status",
          ),
        );
      });
    });

    describe('and the operation was successfully', () => {
      it('should return the same ContestChallenge updated', async () => {
        let err: Error;

        spyOn(service, 'findOne').and.returnValue(contestChallengeDto());
        spyOn(service, 'getUsersFromChallengeId');
        spyOn(service, 'sendUpdatedChallengeStatusNotification');
        const saveContestChallengeSpy = spyOn(
          contestChallengesRepository,
          'save',
        );

        const validStatus = 'squad_formation';
        try {
          await service.updateStatus(1, validStatus);
        } catch (error) {
          err = error;
        }

        expect(err).not.toBeDefined();
        expect(saveContestChallengeSpy).toHaveBeenCalled();
      });

      it('should notify all users of the contest challenge', async () => {
        let err: Error;

        spyOn(service, 'findOne').and.returnValue(contestChallengeDto());
        spyOn(contestChallengesRepository, 'save');
        const bossaboxApiSpy = spyOn(bossaboxApiService, 'sendNotification');
        spyOn(service, 'getUsersFromChallengeId').and.returnValue([
          { bbox_id: 'user-bbox_id-1' },
          { bbox_id: 'user-bbox_id-2' },
        ]);

        const validStatus = 'squad_formation';
        try {
          await service.updateStatus(1, validStatus);
        } catch (error) {
          err = error;
        }

        expect(err).not.toBeDefined();
        expect(bossaboxApiSpy).toHaveBeenCalledWith(expect.any(Object), [
          'user-bbox_id-1',
          'user-bbox_id-2',
        ]);
      });
    });
  });

  describe('when the findChallengesByUser method is called', () => {
    describe('and an unexpected error happend', () => {
      it('should throw an UnexpectedException', async () => {
        let err: Error;
        jest
          .spyOn(conn.createQueryRunner().manager, 'findOne')
          .mockRejectedValue(new Error());
        try {
          await service.findChallengesByUser(parameters.user._id);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpeced-error-find-challenge-by-user',
            'contest-challenges.service.findChallengesByUser',
            err,
          ),
        );
      });
    });
    describe('and the user not found or does not participate in any squad', () => {
      it('should return bad request exception', async () => {
        let err: Error;

        const findChallengesSpy = spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              innerJoin: jest.fn().mockReturnValue({
                innerJoin: jest.fn().mockReturnValue({
                  leftJoinAndSelect: jest.fn().mockReturnValue({
                    leftJoinAndSelect: jest.fn().mockReturnValue({
                      getMany: jest.fn().mockReturnValue(null),
                    }),
                  }),
                }),
              }),
            }),
          }),
        });

        try {
          await service.findChallengesByUser(parameters.user._id);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).not.toBeDefined();
        expect(findChallengesSpy).toHaveBeenCalled();
      });
    });
    describe('and the operation was successfully', () => {
      it('should return the challenges that the user participates', async () => {
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
        squadToUserMock.squad = squadMock;
        mockUserModel.squadToUser = [squadToUserMock];

        jest
          .spyOn(conn.createQueryRunner().manager, 'findOne')
          .mockResolvedValue(mockUserModel);

        const findChallengesSpy = spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              innerJoin: jest.fn().mockReturnValue({
                innerJoin: jest.fn().mockReturnValue({
                  leftJoinAndSelect: jest.fn().mockReturnValue({
                    leftJoinAndSelect: jest.fn().mockReturnValue({
                      getMany: jest.fn().mockReturnValue(null),
                    }),
                  }),
                }),
              }),
            }),
          }),
        });

        try {
          await service.findChallengesByUser(parameters.user._id);
        } catch (error) {
          console.log(error);
          err = error.response.error;
        }
        expect(err).not.toBeDefined();
        expect(findChallengesSpy).toHaveBeenCalled();
      });
    });
  });
});
