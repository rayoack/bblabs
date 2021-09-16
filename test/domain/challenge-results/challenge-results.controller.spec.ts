import { ChallengesResultsController } from '../../../src/domain/challenges-results/challenges-results.controller';
import { challengesResultsServiceMock } from '../../__helpers__/challenges-results.service.mock';

describe('ChallengeResultsController', () => {
  describe('when the get total votes by challenge method is called', () => {
    it('should to call the getTrophiesTotalVotesByChallenge method from ChallengeResultsService', async () => {
      const getTrophiesTotalVotesByChallenge = spyOn(
        challengesResultsServiceMock,
        'getTrophiesTotalVotesByChallenge',
      );
      let err: Error;
      try {
        await new ChallengesResultsController(
          challengesResultsServiceMock,
        ).trophiesTotalVotesByChallenge(1);
      } catch (error) {
        err = error;
      }

      expect(err).not.toBeDefined();
      expect(getTrophiesTotalVotesByChallenge).toHaveBeenCalledTimes(1);
    });
  });
});
