import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ContestChallenges, DeliverablesStages, Fields } from '../entities';
import { ContestChallengesProfessionalsType } from './../entities/contest-challenges-professionals-type.entity';
import { CreateContestChallengeDto } from './dto/create-contest-challenge.dto';
import { UpdateContestChallengeDto } from './dto/update-contest-challenge.dto';

@Injectable()
export class ContestChallengesFactory {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  setNewContestChallenge = async (body: CreateContestChallengeDto) => {
    const newContestChallenge = new ContestChallenges();
    newContestChallenge.status = body.status;
    newContestChallenge.title = body.title;
    newContestChallenge.context = body.context;
    newContestChallenge.headline = body.headline;
    newContestChallenge.startDate = body.startDate;
    newContestChallenge.endDate = body.endDate;
    newContestChallenge.goal = body.goal;
    newContestChallenge.deliverable = body.deliverable;
    newContestChallenge.wallpaperUrl = body.wallpaperUrl;

    if (body.fields && body.fields.length) {
      newContestChallenge.fields = await this.getChallengeFields(body.fields);
    }

    if (body.deliverablesStages && body.deliverablesStages.length) {
      newContestChallenge.deliverablesStages =
        await this.getChallengeDeliverablesStages(body.deliverablesStages);
    }

    return newContestChallenge;
  };

  updateContestChallenge = async (
    contestChallengeToUpdate: ContestChallenges,
    body: UpdateContestChallengeDto,
  ) => {
    contestChallengeToUpdate.status = body.status
      ? body.status
      : contestChallengeToUpdate.status;

    contestChallengeToUpdate.title = body.title
      ? body.title
      : contestChallengeToUpdate.title;

    contestChallengeToUpdate.context = body.context
      ? body.context
      : contestChallengeToUpdate.context;

    contestChallengeToUpdate.headline = body.headline
      ? body.headline
      : contestChallengeToUpdate.headline;

    contestChallengeToUpdate.startDate = body.startDate
      ? body.startDate
      : contestChallengeToUpdate.startDate;

    contestChallengeToUpdate.endDate = body.endDate
      ? body.endDate
      : contestChallengeToUpdate.endDate;

    contestChallengeToUpdate.goal = body.goal
      ? body.goal
      : contestChallengeToUpdate.goal;

    contestChallengeToUpdate.deliverable = body.deliverable
      ? body.deliverable
      : contestChallengeToUpdate.deliverable;

    contestChallengeToUpdate.wallpaperUrl = body.wallpaperUrl
      ? body.wallpaperUrl
      : contestChallengeToUpdate.wallpaperUrl;

    if (body.fields && body.fields.length) {
      contestChallengeToUpdate.fields = await this.getChallengeFields(
        body.fields,
      );
    }

    if (body.deliverablesStages && body.deliverablesStages.length) {
      contestChallengeToUpdate.deliverablesStages =
        await this.getChallengeDeliverablesStages(body.deliverablesStages);
    }

    return contestChallengeToUpdate;
  };

  setNewContestChallengeProfessionalType = async (
    id: number,
    body: CreateContestChallengeDto,
    queryRunner: any,
  ) => {
    const newChallengesProfessionalsTypes: ContestChallengesProfessionalsType[] =
      body.professionalsAmount.map((professionalAmount) => {
        professionalAmount.contestChallengesId = id;
        return professionalAmount;
      });

    await this.saveContestChallengesProfessionalsType(
      newChallengesProfessionalsTypes,
      queryRunner,
    );

    return newChallengesProfessionalsTypes;
  };

  private getChallengeFields = async (ids: number[]) => {
    const selectedFields = await this.connection
      .getRepository(Fields)
      .createQueryBuilder()
      .where(`id IN (${ids})`)
      .getMany();
    return selectedFields;
  };

  private getChallengeDeliverablesStages = async (ids: number[]) => {
    const deliverablesStages = await this.connection
      .getRepository(DeliverablesStages)
      .createQueryBuilder()
      .where(`id IN (${ids})`)
      .getMany();
    return deliverablesStages;
  };

  private async saveContestChallengesProfessionalsType(
    newChallengesProfessionalsTypes: ContestChallengesProfessionalsType[],
    queryRunner,
  ) {
    const savedProfessionalsType = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(ContestChallengesProfessionalsType)
      .values(newChallengesProfessionalsTypes)
      .execute();

    return savedProfessionalsType;
  }
}
