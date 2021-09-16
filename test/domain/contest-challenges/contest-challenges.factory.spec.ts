import { ContestChallengesFactory } from '../../../src/domain/contest-challenges/contest-challenges.factory';
import { ContestChallenges } from '../../../src/domain/entities';
import {
  contestChallengeDto,
  updateContestChallengeDto,
} from '../../__helpers__/contest-challenge.service.mock';

const connectionMock: any = {
  getRepository: jest.fn().mockReturnValue({
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        getMany: jest.fn(),
      }),
    }),
  }),
};

const queryRunnerMock: any = {
  manager: {
    createQueryBuilder: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnValue({
        into: jest.fn().mockReturnValue({
          values: jest.fn().mockReturnValue({
            execute: jest.fn(),
          }),
        }),
      }),
    }),
  },
};

describe('ContestChallengesFactory', () => {
  let contestChallengesFactory: ContestChallengesFactory;

  beforeAll(() => {
    contestChallengesFactory = new ContestChallengesFactory(connectionMock);
  });
  describe('when the setNewContestChallenge method is called', () => {
    describe('and the argument has fields', () => {
      it('should to search for this ids and add to the resposnse', async () => {
        let err: Error;
        try {
          await contestChallengesFactory.setNewContestChallenge(
            contestChallengeDto([1]),
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });

    describe('and the argument doesnt has fields', () => {
      it('should to ignore this parameter', async () => {
        let err: Error;
        try {
          await contestChallengesFactory.setNewContestChallenge(
            contestChallengeDto(null),
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });

    describe('and the argument has fields but not is an array', () => {
      it('should to ignore this parameter', async () => {
        let err: Error;
        try {
          await contestChallengesFactory.setNewContestChallenge({
            ...contestChallengeDto(null),
            fields: 1,
          } as any);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });
  });
  describe('when the updateContestChallenge method is called', () => {
    describe('and the argument has fields', () => {
      it('should to search for this ids and add to the resposnse', async () => {
        let err: Error;
        try {
          await contestChallengesFactory.updateContestChallenge(
            new ContestChallenges(),
            updateContestChallengeDto([1]),
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });

    describe('and the argument doesnt has fields', () => {
      it('should to ignore this parameter', async () => {
        let err: Error;
        try {
          await contestChallengesFactory.updateContestChallenge(
            new ContestChallenges(),
            updateContestChallengeDto(null),
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });

    describe('and the argument has fields but not is an array', () => {
      it('should to ignore this parameter', async () => {
        let err: Error;
        try {
          await contestChallengesFactory.updateContestChallenge(
            new ContestChallenges(),
            { ...updateContestChallengeDto(null), fields: 1 } as any,
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });

    Object.keys(updateContestChallengeDto()).forEach((value) => {
      describe(`when some ${value} property doest is passed`, () => {
        it('should to get the value from the original entity', async () => {
          let err: Error;
          try {
            const updateDto: any = updateContestChallengeDto();
            delete updateDto[value];
            await contestChallengesFactory.updateContestChallenge(
              new ContestChallenges(),
              updateDto,
            );
          } catch (error) {
            err = error;
          }
          expect(err).not.toBeDefined();
        });
      });
    });
  });

  describe('when the setNewContestChallengeProfessionalType method is called', () => {
    describe('and the argument has fields', () => {
      it('should to search for this ids and add to the resposnse', async () => {
        let err: Error;
        try {
          await contestChallengesFactory.setNewContestChallengeProfessionalType(
            1,
            contestChallengeDto(),
            queryRunnerMock,
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
      });
    });
  });
});
