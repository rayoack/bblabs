import { Repository } from 'typeorm';
import { ChallengesResults } from '../../src/domain/entities';

export const challengesResultsRepository = () =>
  new Repository<ChallengesResults>();

export const challengesResultsServiceMock: any = {
  getTrophiesTotalVotesByChallenge: jest.fn(),
};
