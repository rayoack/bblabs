import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserBossaboxDto } from '../../auth/dto/user-bossabox.dto';
import { Connection, In } from 'typeorm';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { UnexpectedException } from '../../exceptions/unexpected.exception';
import {
  ContestChallenges,
  ContestChallengesStatusEnum,
} from '../entities/contest-challenge.entity';

import { BossaboxApiService } from '../../integrations/bossabox-api.service';
import { ContestChallengesFactory } from './contest-challenges.factory';
import { ContestChallengesRepository } from './contest-challenges.repository';
import { Users } from '../entities';
import { UserRepository } from '../users/users.repository';
import { CreateContestChallengeDto } from './dto/create-contest-challenge.dto';
import { UpdateContestChallengeDto } from './dto/update-contest-challenge.dto';
import { VotesService } from '../votes/votes.service';

@Injectable()
export class ContestChallengesService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(ContestChallenges)
    private contestChallengesRepository: ContestChallengesRepository,
    @InjectRepository(Users)
    private usersRepository: UserRepository,
    private readonly contestChallengesFactory: ContestChallengesFactory,
    private readonly bossaboxApiService: BossaboxApiService,
    private readonly votesService: VotesService,
    private bossaboxApi: BossaboxApiService,
  ) {}

  async joinToCommunity(userDto: UserBossaboxDto) {
    await this.bossaboxApi.joinToLabsCommunity(userDto.token);
    return process.env.SLACK_WORKSPACE_URL;
  }

  async create(body: CreateContestChallengeDto): Promise<ContestChallenges> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      const contestChallenge = { ...body };
      delete contestChallenge.professionalsAmount;
      await queryRunner.startTransaction();

      const newContestChallenge =
        await this.contestChallengesFactory.setNewContestChallenge(
          contestChallenge,
        );
      const newContestChallengeSaved = await queryRunner.manager.save(
        newContestChallenge,
      );

      newContestChallengeSaved.contestChallengesProfessionalsType =
        await this.contestChallengesFactory.setNewContestChallengeProfessionalType(
          newContestChallengeSaved.id,
          body,
          queryRunner,
        );

      await queryRunner.commitTransaction();

      return newContestChallengeSaved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new UnexpectedException(
        'unexpected-error-create-a-challenge',
        'contest-challenges.service.create',
        err,
      );
    }
  }

  async findAll(
    options: IPaginationOptions<any>,
    status: string,
  ): Promise<Pagination<ContestChallenges>> {
    try {
      return await paginate<ContestChallenges>(
        this.contestChallengesRepository,
        options,
        {
          order: { id: 'ASC' },
          relations: [
            'fields',
            'contestChallengesProfessionalsType',
            'contestChallengesProfessionalsType.professionalsType',
          ],
          where: { status: In(status.split(',')) },
        },
      );
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-find-all-challenges',
        'contest-challenges.service.findAll',
        err,
      );
    }
  }

  async countChallengesByStatus() {
    try {
      const countChallengesByStatus = await this.contestChallengesRepository
        .createQueryBuilder('contestChallenges')
        .select(['status', 'CAST(COUNT(status) AS INTEGER)'])
        .groupBy('status')
        .getRawMany();

      const statusAvailabes = countChallengesByStatus.map(
        (challenge) => challenge.status,
      );

      Object.keys(ContestChallengesStatusEnum)
        .filter((key) => !isNaN(Number(ContestChallengesStatusEnum[key])))
        .map((challengeStatus: string) => {
          if (!statusAvailabes.includes(challengeStatus)) {
            countChallengesByStatus.push({
              status: challengeStatus,
              count: 0,
            });
          }
        });

      return countChallengesByStatus;
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-count-challenges-by-status',
        'contest-challenges.service.countChallengesByStatus',
        err,
      );
    }
  }

  async findOne(id: number): Promise<ContestChallenges> {
    let contestChallenge: ContestChallenges;
    try {
      const findOneParam = id ? { id } : {};

      contestChallenge = await this.contestChallengesRepository.findOne(
        findOneParam,
        {
          relations: [
            'fields',
            'contestChallengesProfessionalsType',
            'contestChallengesProfessionalsType.professionalsType',
            'deliverablesStages',
          ],
        },
      );
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-find-one-challenge',
        'contest-challenges.service.findOne',
        err,
      );
    }

    if (!contestChallenge) {
      throw new EntityNotFoundException(
        'challenge-not-found',
        'ContestChallenges',
        id ? id : null,
      );
    }
    return contestChallenge;
  }

  async update(
    id: number,
    updateContestChallengeData: UpdateContestChallengeDto,
  ): Promise<ContestChallenges> {
    let contestChallengeToUpdate = await this.findOne(id);
    contestChallengeToUpdate =
      await this.contestChallengesFactory.updateContestChallenge(
        { ...contestChallengeToUpdate },
        updateContestChallengeData,
      );
    try {
      return await this.contestChallengesRepository.save(
        contestChallengeToUpdate,
      );
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-update-challenge',
        'contest-challenges.service.update',
        err,
      );
    }
  }

  async delete(id: number) {
    let result;
    try {
      result = await this.contestChallengesRepository.delete(id);
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-delete-challenge',
        'contest-challenges.service.delete',
        err,
      );
    }
    if (!result || result.affected === 0) {
      throw new EntityNotFoundException(
        'challenge-not-found-delete',
        'ContestChallenges',
        id,
      );
    }
    return result;
  }

  async findChallengesByUser(userBboxId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      return await queryRunner.manager
        .getRepository(ContestChallenges)
        .createQueryBuilder('contestChallenges')
        .innerJoinAndSelect('contestChallenges.squads', 'squads')
        .innerJoin('squads.squadToUser', 'squadToUser')
        .innerJoin('squadToUser.user', 'user', `user.bbox_id = :userBboxId`, {
          userBboxId,
        })
        .leftJoinAndSelect('contestChallenges.fields', 'fields')
        .leftJoinAndSelect(
          'squads.challengeResults',
          'challengeResults',
          'challengeResults.position IN (1,2,3)',
        )
        .getMany();
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-find-challenge-by-user',
        'contest-challenges.service.findChallengesByUser',
        err,
      );
    }
  }

  private statusIsValid(status: string): boolean {
    const statusKeys = Object.keys(ContestChallengesStatusEnum);
    return statusKeys.includes(status);
  }

  async getUsersFromChallengeId(contestChallengeId) {
    const challengeSquadUsers = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.squadToUser', 'squadToUser')
      .innerJoinAndSelect('squadToUser.squad', 'squad')
      .innerJoinAndSelect('squad.contestChallenge', 'contestChallenge')
      .where('contestChallenge.id = :id', { id: contestChallengeId })
      .getMany();

    return challengeSquadUsers;
  }

  async sendUpdatedChallengeStatusNotification(
    contestChallengeId: number,
    { title, text, url },
  ) {
    const challengeUsers = await this.getUsersFromChallengeId(
      contestChallengeId,
    );
    const challengeUsersBBIds = challengeUsers.map((user) => user.bbox_id);

    const notification = {
      title: title,
      text: text,
      iconType: 'challenge',
      url: url,
    };

    await this.bossaboxApiService.sendNotification(
      notification,
      challengeUsersBBIds,
    );
  }

  private getNotificationTexts(status: string, challengeTitle: string) {
    const notificationsTextData = {
      squad_formation: {
        title: 'Encontre sua equipe 😊',
        text: 'Um novo desafio está preste a começar e você já pode se juntar a outros profissionais incríveis! Clique aqui para formar um squad ou participar de algum que já exista.',
      },
      in_progress: {
        title: 'Uhul! Começou o desafio 🥷',
        text: `O desafio ${challengeTitle} começou! Clique aqui e veja todos os entregáveis que deverão acontecer.`,
      },
      in_voting: {
        title: 'Desafio encerrado 🙌',
        text: `O período para realizar o desafio ${challengeTitle} encerrou, agora é hora de escolhermos as melhores soluções! Clique aqui e dê seu voto.`,
      },
      completed: {
        title: 'Conheça os vencedores 🥁',
        text: `Encerramos a votação do desafio ${challengeTitle}. Clique aqui e veja o ranking de classificação.`,
      },
    };
    return notificationsTextData[status];
  }

  async updateStatus(id: number, status: string): Promise<ContestChallenges> {
    const contestChallengeToUpdate = await this.findOne(id);
    if (!contestChallengeToUpdate) {
      throw new EntityNotFoundException(
        'challenge-not-found-updateStatus',
        'ContestChallenges',
        id,
      );
    }

    if (!this.statusIsValid(status)) {
      throw new BadRequestException(
        'bad-request-update-status-challenge',
        "Invalid challenge's status",
      );
    }

    contestChallengeToUpdate.status = status;
    if (status === 'completed') {
      await this.votesService.completeVotation(id);
    }

    try {
      const challengeTitle = contestChallengeToUpdate.title;
      const { title, text } = this.getNotificationTexts(status, challengeTitle);
      const notification = {
        title,
        text,
        url: '/bossabox-labs/como-funciona/desafios',
      };

      const contestChallenge = await this.contestChallengesRepository.save(
        contestChallengeToUpdate,
      );
      await this.sendUpdatedChallengeStatusNotification(id, notification);
      return contestChallenge;
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-update-status-challenge',
        'contest-challenges.service.updateStatus',
        err,
      );
    }
  }
}
