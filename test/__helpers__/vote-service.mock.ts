import { Repository } from 'typeorm';
import { Squad } from '../../src/domain/entities';
import { UserRepository } from '../../src/domain/users/users.repository';
import { VoteRepository } from '../../src/domain/votes/votes.repository';

const squadRepository = () => new Repository<Squad>();
const userRepository = () => new UserRepository();
const voteRepository = () => new VoteRepository();

export { squadRepository, userRepository, voteRepository };

export const voteServiceMock = (): any => ({
  voteInSquadToTrophy: jest.fn(),
  removeSquadVote: jest.fn(),
  getUserVotes: jest.fn(),
  getChallengeRanking: jest.fn(),
});
