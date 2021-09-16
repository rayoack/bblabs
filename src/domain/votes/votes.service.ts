import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserBossaboxDto } from '../../auth/dto/user-bossabox.dto';
import { UnexpectedException } from '../../exceptions/unexpected.exception';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import {
  ChallengesResults,
  ContestChallenges,
  Users,
  Votes,
} from '../entities';
import { Squad } from '../entities/squad.entity';
import { UserRepository } from '../users/users.repository';
import { VoteRepository } from './votes.repository';
import { VoteInSquadDto } from './dto/vote-in-squad.dto';
import { SquadRepository } from '../squad/squad.repository';
import { TrophyTypes } from '../entities/vote.entity';
import { ChallengeResultsRankByTrophiesDto } from '../challenges-results/dtos/challenge-results-rank-trophies.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Votes)
    private voteRepository: VoteRepository,
    @InjectRepository(Users)
    private readonly userRepository: UserRepository,
    @InjectRepository(Squad)
    private readonly squadRepository: SquadRepository,
    @InjectConnection()
    private connection: Connection,
  ) {}

  async voteInSquadToTrophy(
    user: UserBossaboxDto,
    voteInSquadDto: VoteInSquadDto,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const contestChallenge = await queryRunner.manager
        .getRepository(ContestChallenges)
        .createQueryBuilder('contestChallenges')
        .innerJoinAndSelect('contestChallenges.squads', 'squads')
        .where(`contestChallenges.id = :challengeId and squads.id = :squadId`, {
          challengeId: voteInSquadDto.contestChallengeId,
          squadId: voteInSquadDto.squadId,
        })
        .getOne();

      if (!contestChallenge)
        throw new EntityNotFoundException(
          'challenge-not-found-vote-in-squad-to-trophy',
          'ContestChallenges',
          voteInSquadDto.contestChallengeId,
        );

      const squad = contestChallenge.squads[0];

      if (contestChallenge.status !== 'in_voting')
        throw new BadRequestException(
          'Este desafio não está disponível para votação',
        );

      const member = await this.userRepository.findOneOrFail({
        bbox_id: user._id,
      });

      const userAlreadyVotedForThisTrophy = await queryRunner.manager.findOne(
        Votes,
        {
          contestChallenge,
          user: member,
          trophyType: voteInSquadDto.trophyTypeId,
        },
      );

      if (userAlreadyVotedForThisTrophy)
        throw new BadRequestException(
          'Este usuário já votou nesta categoria de troféu',
        );

      await queryRunner.manager.save(Votes, {
        contestChallenge,
        user: member,
        trophyType: voteInSquadDto.trophyTypeId,
        squad,
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new UnexpectedException(
        `unexpected-error-vote-in-squad-to-trophy`,
        `VoteService.voteInSquadToTrophy`,
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async removeSquadVote(
    contestChallengeId: number,
    trophyTypeId: number,
    user: UserBossaboxDto,
  ) {
    if (!contestChallengeId) {
      throw new BadRequestException('O id do desafio é obrigatório');
    }
    if (!trophyTypeId) {
      throw new BadRequestException('O id do tipo de troféu é obrigatório');
    }
    try {
      const member = await this.userRepository.findOneOrFail({
        bbox_id: user._id,
      });

      const vote = await this.voteRepository.findOne({
        contestChallengeId,
        trophyType: trophyTypeId,
        user: member,
      });

      await this.voteRepository.delete(vote.id);
    } catch (error) {
      throw new UnexpectedException(
        'remove-squad-vote',
        'VoteService.removeSquadVote',
        error,
      );
    }
  }

  async getUserVotes(
    contestChallengeId: number,
    user: UserBossaboxDto,
    action: string,
  ) {
    try {
      const member = await this.userRepository.findOneOrFail({
        bbox_id: user._id,
      });

      const votes: any[] = await this.voteRepository.find({
        where: {
          contestChallengeId,
          user: member,
        },
        relations: ['squad'],
      });

      const votesMapped = votes.map((vote) => {
        vote.trophyType = {
          id: vote.trophyType,
          name: TrophyTypes[vote.trophyType],
        };
        return vote;
      });

      let squads = [];

      if (!this.userVotedInAllTrophies(votes) && action.includes('squads')) {
        squads = await this.connection
          .createQueryBuilder(Squad, 'squad')
          .where({ contestChallengeId })
          .orderBy('RANDOM()')
          .getMany();
      }

      return {
        votes: votesMapped,
        squads,
      };
    } catch (error) {
      throw new UnexpectedException(
        'get-user-votes',
        'VoteService.getUserVotes',
        error,
      );
    }
  }

  async getChallengeRanking(contestChallengeId: number, trophyType: number) {
    try {
      const challengeResults = await this.connection
        .createQueryBuilder(ChallengesResults, 'challengeResults')
        .where({ contestChallengeId, trophyType })
        .leftJoinAndSelect('challengeResults.squad', 'squad')
        .orderBy('challengeResults.position', 'ASC')
        .getMany();

      if (!challengeResults)
        throw new EntityNotFoundException(
          'challenge-results-not-found-get-challenge-ranking',
          'ChallengesResults',
          contestChallengeId,
        );

      const totalVotes = challengeResults.reduce((a, b) => a + b.votes, 0);

      return {
        ranking: challengeResults,
        totalVotes,
      };
    } catch (error) {
      throw new UnexpectedException(
        'get-challenge-ranking',
        'VoteService.getChallengeRanking',
        error,
      );
    }
  }

  private userVotedInAllTrophies(votes) {
    const trophyTypesKeys = Object.keys(TrophyTypes);
    return trophyTypesKeys.length === votes.length;
  }

  private orderChallengeTrophiesRank(
    challengeResults: ChallengeResultsRankByTrophiesDto[],
  ) {
    let challengeResutsRankedByTrophies = [];
    Object.keys(TrophyTypes)
      .filter((key) => isNaN(Number(TrophyTypes[key])))
      .map((trophyType: string) => {
        const filtered = challengeResults.filter(
          (result) => result.trophyType === trophyType,
        );

        const sortedVotes = filtered
          .sort((result, resultB) => resultB.votes - result.votes)
          .map((result) => result.votes);

        const ranks = filtered.map((result) => ({
          ...result,
          position: sortedVotes.indexOf(result.votes) + 1,
        }));
        challengeResutsRankedByTrophies = [
          ...challengeResutsRankedByTrophies,
          ...ranks,
        ];
      });

    return challengeResutsRankedByTrophies;
  }

  async completeVotation(contestChallengeId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const squadsAndTrophiesSubquery = await queryRunner.manager
        .getRepository(Squad)
        .createQueryBuilder('squad')
        .addFrom('pg_enum', 'enum')
        .select('enum.enumlabel AS "trophy_type"')
        .addSelect('squad.contestChallengeId AS "contestchallengeid"')
        .addSelect('squad.id AS "squadid"')
        .innerJoin('pg_type', 'type', 'enum.enumtypid = type.oid')
        .where(
          "type.typname = 'votes_trophytype_enum' and squad.contestChallengeId = :contestChallengeId",
          { contestChallengeId },
        );

      const challengeResultsRank: ChallengeResultsRankByTrophiesDto[] =
        await queryRunner.manager
          .createQueryBuilder()
          .addFrom(`(${squadsAndTrophiesSubquery.getQuery()})`, 'squad_trophy')
          .select('squad_trophy.squadId AS "squadId"')
          .addSelect('squad_trophy.trophy_type AS "trophyType"')
          .addSelect('squad_trophy.contestChallengeId AS "contestChallengeId"')
          .addSelect('CAST(COUNT(votes.id) AS INTEGER) AS "votes"')
          .leftJoin(
            Votes,
            'votes',
            'votes."trophyType"::text = squad_trophy.trophy_type and votes."squadId" = squad_trophy.squadId',
          )
          .where('squad_trophy.contestChallengeId = :contestChallengeId', {
            contestChallengeId,
          })
          .groupBy('squad_trophy.squadId')
          .addGroupBy('squad_trophy.trophy_type')
          .addGroupBy('squad_trophy.contestChallengeId')
          .getRawMany();

      const challengeResultsRankedByTrophies =
        this.orderChallengeTrophiesRank(challengeResultsRank);

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(ChallengesResults)
        .values(challengeResultsRankedByTrophies)
        .execute();

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new UnexpectedException(
        `unexpected-error-complete-votation`,
        `VoteService.completeVotation`,
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
