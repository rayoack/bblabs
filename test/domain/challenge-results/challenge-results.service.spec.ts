jest.mock('nestjs-typeorm-paginate');

import { ChallengesResultsService } from '../../../src/domain/challenges-results/challenges-results.service';
import { challengesResultsRepository } from '../../__helpers__/challenges-results.service.mock';

describe('ChallengesResultsService', () => {
  let service: ChallengesResultsService;
  const challengesResultsRepo = challengesResultsRepository();
  beforeAll(() => {
    service = new ChallengesResultsService(challengesResultsRepo);
  });
  describe('when the getTrophiesTotalVotesByChallenge method is called', () => {
    describe('and a valid challengeId is passed', () => {
      it("should return the votes' sum of each category", async () => {
        let err: Error;
        const getTrophiesTotalVotesByChallenge = spyOn(
          challengesResultsRepo,
          'createQueryBuilder',
        ).and.returnValue({
          select: jest.fn().mockReturnValue({
            addSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                groupBy: jest.fn().mockReturnValue({
                  getRawMany: jest.fn().mockReturnValue(null),
                }),
              }),
            }),
          }),
        });

        const validChallengeId = 1;
        try {
          await service.getTrophiesTotalVotesByChallenge(validChallengeId);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(getTrophiesTotalVotesByChallenge).toHaveBeenCalledTimes(1);
      });
    });
  });
});
