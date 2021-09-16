import { BadRequestException } from '@nestjs/common';
import { Squad } from '../../../src/domain/entities/squad.entity';
import { EntityNotFoundException } from '../../../src/exceptions/entity-not-found.exception';
import { UnexpectedException } from '../../../src/exceptions/unexpected.exception';
import { connection } from '../../__helpers__/connection.mock';
import {
  createAProfessionalType,
  createContestChallenge,
  createSquad,
  createSquadToUser,
} from '../../__helpers__/factories/factories';
import { VotesService } from '../../../src/domain/votes/votes.service';
import {
  voteRepository,
  squadRepository,
  userRepository,
} from '../../__helpers__/vote-service.mock';
import { mockUserModel } from '../../__helpers__/user-util.mock';
import {
  ChallengesResults,
  ContestChallenges,
  Votes,
} from '../../../src/domain/entities';

import { ChallengeResultsRankByTrophiesDto } from '../../../src/domain/challenges-results/dtos/challenge-results-rank-trophies.dto';

const parameters = {
  contestChallengeId: 1,
  user: {
    _id: 'b3bdbs023923988sdj3',
    email: 'email@mail.com',
    fullName: 'Testando',
    token: '',
  },
  voteInSquadDto: {
    squadId: 'squadId',
    contestChallengeId: 1,
    trophyTypeId: 1,
  },
};

const newSquadDto = {
  description: 'description',
  name: 'name',
  professionalTypeId: 1,
  avatar: 'https://i.pravatar.cc/300',
  slug: 'test/profile/me',
};

const voteMock: Votes = {
  id: 1,
  includedAt: new Date(),
  trophyType: 1,
  contestChallengeId: 1,
  squadId: 'abc',
  userId: 4,
  contestChallenge: new ContestChallenges(),
  squad: new Squad(),
  user: mockUserModel,
};

describe('VotesService', () => {
  describe(`when a user voted in a squad to trophy`, () => {
    describe(`when the challenge is not found`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue(null),
              }),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.voteInSquadToTrophy(
            parameters.user,
            parameters.voteInSquadDto,
          );
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'challenge-not-found-vote-in-squad-to-trophy',
            'ContestChallenges',
            1,
          ),
        );
      });
    });

    describe(`when an unexpected error happend trying to find the challenge`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue(new Error()),
              }),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.voteInSquadToTrophy(
            parameters.user,
            parameters.voteInSquadDto,
          );
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            `unexpected-error-vote-in-squad-to-trophy`,
            `VoteService.voteInSquadToTrophy`,
            new Error(),
          ),
        );
      });
    });

    describe(`when the challenge is not in the voting stage`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const contestChallengeMock = createContestChallenge([
          { professionalsType: { id: 1 } },
        ]);

        spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue(contestChallengeMock),
              }),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.voteInSquadToTrophy(
            parameters.user,
            parameters.voteInSquadDto,
          );
        } catch (error) {
          console.log(error);
          err = error.response.error;
        }
        expect(err).toEqual(
          new BadRequestException(
            'Este desafio não está disponível para votação',
          ),
        );
      });
    });

    describe(`when the challenge is not in the voting stage`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const contestChallengeMock = createContestChallenge([
          { professionalsType: { id: 1 } },
        ]);

        spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue(contestChallengeMock),
              }),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.voteInSquadToTrophy(
            parameters.user,
            parameters.voteInSquadDto,
          );
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new BadRequestException(
            'Este desafio não está disponível para votação',
          ),
        );
      });
    });

    describe(`when the user has already voted for this trophy type`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const contestChallengeMock = createContestChallenge(
          [{ professionalsType: { id: 1 } }],
          'in_voting',
        );
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );

        contestChallengeMock.squads = [squadMock];

        spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue(contestChallengeMock),
              }),
            }),
          }),
        });

        jest.spyOn(userRepo, 'findOneOrFail').mockResolvedValue(mockUserModel);

        jest
          .spyOn(conn.createQueryRunner().manager, 'findOne')
          .mockResolvedValue(voteMock);

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.voteInSquadToTrophy(
            parameters.user,
            parameters.voteInSquadDto,
          );
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new BadRequestException(
            'Este usuário já votou nesta categoria de troféu',
          ),
        );
      });
    });

    describe(`when the user can vote for a trophy for the squad`, () => {
      it(`should the operation was successfully`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const contestChallengeMock = createContestChallenge(
          [{ professionalsType: { id: 1 } }],
          'in_voting',
        );
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );

        contestChallengeMock.squads = [squadMock];

        spyOn(
          conn.createQueryRunner().manager,
          'getRepository',
        ).and.returnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            innerJoinAndSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue(contestChallengeMock),
              }),
            }),
          }),
        });

        jest.spyOn(userRepo, 'findOneOrFail').mockResolvedValue(mockUserModel);

        jest
          .spyOn(conn.createQueryRunner().manager, 'findOne')
          .mockResolvedValue(null);

        const saveSpy = jest.spyOn(conn.createQueryRunner().manager, 'save');

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.voteInSquadToTrophy(
            parameters.user,
            parameters.voteInSquadDto,
          );
        } catch (error) {
          err = error.response.error;
        }
        expect(err).not.toBeDefined();
        expect(saveSpy).toHaveBeenCalled();
      });
    });
  });

  describe(`when a user remove a vote for a squad`, () => {
    describe(`when the challengeId is not passed by the parameters`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();

        const service = new VotesService(
          voteRepo,
          userRepo,
          squadRepo,
          connection(),
        );
        let err: Error;
        try {
          await service.removeSquadVote(null, 1, parameters.user);
        } catch (error) {
          err = error.response.message;
        }
        expect(err).toEqual('O id do desafio é obrigatório');
      });
    });

    describe(`when the trophyTypeId is not passed by the parameters`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();

        const service = new VotesService(
          voteRepo,
          userRepo,
          squadRepo,
          connection(),
        );
        let err: Error;
        try {
          await service.removeSquadVote(1, null, parameters.user);
        } catch (error) {
          err = error.response.message;
        }
        expect(err).toEqual('O id do tipo de troféu é obrigatório');
      });
    });

    describe(`when an unexpected error happend`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();

        const service = new VotesService(
          voteRepo,
          userRepo,
          squadRepo,
          connection(),
        );

        spyOn(userRepo, 'findOneOrFail').and.returnValue(new Error());

        let err: Error;
        try {
          await service.removeSquadVote(1, 1, parameters.user);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'remove-squad-vote',
            'VoteService.removeSquadVote',
            new Error(),
          ),
        );
      });
    });

    describe(`when remove a vote`, () => {
      it(`should to remove the vote`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();

        const service = new VotesService(
          voteRepo,
          userRepo,
          squadRepo,
          connection(),
        );

        spyOn(userRepo, 'findOneOrFail').and.returnValue(mockUserModel);
        jest.spyOn(voteRepo, 'findOne').mockResolvedValue(voteMock);

        const deleteSpy = spyOn(voteRepo, 'delete');

        let err: Error;
        try {
          await service.removeSquadVote(1, 1, parameters.user);
        } catch (error) {
          console.log(error);
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(deleteSpy).toHaveBeenCalled();
      });
    });
  });

  describe(`when getUserVotes is called'`, () => {
    describe(`when an unexpected error happend`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();

        spyOn(userRepo, 'findOneOrFail').and.returnValue(new Error());

        const service = new VotesService(
          voteRepo,
          userRepo,
          squadRepo,
          connection(),
        );
        let err: Error;
        try {
          await service.getUserVotes(1, parameters.user, 'votes');
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'get-user-votes',
            'VoteService.getUserVotes',
            err,
          ),
        );
      });
    });
    describe(`when get vote without squads`, () => {
      it(`should to return votes and squad in empty array`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();

        const contestChallengeMock = createContestChallenge(
          [{ professionalsType: { id: 1 } }],
          'in_voting',
        );
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );

        spyOn(userRepo, 'findOneOrFail').and.returnValue(mockUserModel);
        const findVoteSpy = jest
          .spyOn(voteRepo, 'find')
          .mockResolvedValue([voteMock]);
        const findSquadsSpy = jest
          .spyOn(squadRepo, 'find')
          .mockResolvedValue([squadMock]);

        const service = new VotesService(
          voteRepo,
          userRepo,
          squadRepo,
          connection(),
        );
        let err: Error;
        try {
          await service.getUserVotes(1, parameters.user, 'votes');
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findVoteSpy).toHaveBeenCalled();
        expect(findSquadsSpy).not.toBeCalled();
      });
    });
    describe(`when get vote with the squads`, () => {
      it(`should to return votes and squads`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const contestChallengeMock = createContestChallenge(
          [{ professionalsType: { id: 1 } }],
          'in_voting',
        );
        const professionalTypeMock = createAProfessionalType();
        const squadToUserMock = createSquadToUser(
          mockUserModel,
          professionalTypeMock,
        );
        const squadMock = createSquad(
          newSquadDto,
          contestChallengeMock,
          mockUserModel,
          squadToUserMock,
        );

        spyOn(userRepo, 'findOneOrFail').and.returnValue(mockUserModel);
        const findVoteSpy = jest
          .spyOn(voteRepo, 'find')
          .mockResolvedValue([voteMock]);

        const findSquadsSpy = spyOn(
          conn.createQueryBuilder(),
          'where',
        ).and.returnValue({
          orderBy: jest.fn().mockReturnValue({
            getMany: jest.fn().mockReturnValue(null),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.getUserVotes(1, parameters.user, 'squads');
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findVoteSpy).toHaveBeenCalled();
        expect(findSquadsSpy).toHaveBeenCalled();
      });
    });
  });

  describe(`when getChallengeRanking is called'`, () => {
    describe(`when an unexpected error happend`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        spyOn(conn.createQueryBuilder(), 'where').and.returnValue({
          leftJoinAndSelect: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              getMany: jest.fn().mockReturnValue(new Error()),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.getChallengeRanking(1, 1);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'get-challenge-ranking',
            'VoteService.getChallengeRanking',
            err,
          ),
        );
      });
    });
    describe(`when an challenge results is not found`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const rankingResultSpy = spyOn(
          conn.createQueryBuilder(),
          'where',
        ).and.returnValue({
          leftJoinAndSelect: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              getMany: jest.fn().mockReturnValue(null),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.getChallengeRanking(1, 1);
        } catch (error) {
          err = error.response.error;
        }
        expect(err).toEqual(
          new EntityNotFoundException(
            'challenge-results-not-found-get-challenge-ranking',
            'ChallengesResults',
            1,
          ),
        );
      });
    });
    describe(`when an operation was successfully`, () => {
      it(`should to return ranking and total votes`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const challengeResultsMock: ChallengesResults = {
          id: 1,
          trophyType: 1,
          contestChallengeId: 1,
          squadId: 'abc',
          contestChallenge: new ContestChallenges(),
          squad: new Squad(),
          votes: 2,
          position: 1,
        };

        const rankingResultSpy = spyOn(
          conn.createQueryBuilder(),
          'where',
        ).and.returnValue({
          leftJoinAndSelect: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              getMany: jest.fn().mockReturnValue([challengeResultsMock]),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.getChallengeRanking(1, 1);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(rankingResultSpy).toHaveBeenCalled();
      });
    });
  });

  describe(`when completeVotation is called'`, () => {
    describe(`when an unexpected error happend`, () => {
      it(`should to throw an exception`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        spyOn(conn.getRepository(), 'createQueryBuilder').and.returnValue({
          select: jest.fn().mockReturnValue({
            groupBy: jest.fn().mockReturnValue({
              addGroupBy: jest.fn().mockReturnValue({
                addGroupBy: jest.fn().mockReturnValue({
                  where: jest.fn().mockReturnValue({
                    getRawMany: jest.fn().mockReturnValue(new Error()),
                  }),
                }),
              }),
            }),
          }),
        });

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.completeVotation(1);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'unexpected-error-complete-votation',
            'VoteService.completeVotation',
            err,
          ),
        );
      });
    });
    describe(`when an operation was successfully`, () => {
      it(`should to order ranking and insert into ChallengesResults`, async () => {
        const userRepo = userRepository();
        const squadRepo = squadRepository();
        const voteRepo = voteRepository();
        const conn = connection();

        const ChallengeResultsRankByTrophiesMock: ChallengeResultsRankByTrophiesDto =
          {
            squadId: '1abc',
            contestChallengeId: 1,
            trophyType: 'better_solution',
            votes: 1,
            position: 1,
          };

        const manager: any = {
          createQueryBuilder: () => manager,
          getRepository: () => manager,
          addFrom: () => manager,
          select: () => manager,
          addSelect: () => manager,
          groupBy: () => manager,
          addGroupBy: () => manager,
          leftJoin: () => manager,
          innerJoin: () => manager,
          where: () => manager,
          getQuery: () => '',
          getRawMany: () => [ChallengeResultsRankByTrophiesMock],
          insert: () => manager,
          into: () => manager,
          values: () => manager,
          execute: () => manager,
        };
        const queryRunnerSpy = spyOn(conn, 'createQueryRunner').and.returnValue(
          {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: manager,
          },
        );

        const service = new VotesService(voteRepo, userRepo, squadRepo, conn);
        let err: Error;
        try {
          await service.completeVotation(1);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(queryRunnerSpy).toHaveBeenCalled();
      });
    });
  });
});
