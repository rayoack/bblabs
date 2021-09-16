import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengesResults } from '../entities';

@Injectable()
export class ChallengesResultsService {
  constructor(
    @InjectRepository(ChallengesResults)
    private readonly challengesResultsRepository: Repository<ChallengesResults>,
  ) {}

  async getTrophiesTotalVotesByChallenge(contestChallengeId: number) {
    return this.challengesResultsRepository
      .createQueryBuilder('challengesResults')
      .select('sum("votes") AS "totalVotes"')
      .addSelect('challengesResults.trophyType AS "trophyType"')
      .where(`challengesResults.contestChallengeId = :contestChallengeId`, {
        contestChallengeId,
      })
      .groupBy('challengesResults.trophyType')
      .getRawMany();
  }
}
