import { Repository, EntityRepository } from 'typeorm';
import { ContestChallenges } from '../entities';

@EntityRepository(ContestChallenges)
export class ContestChallengesRepository extends Repository<ContestChallenges> {}
