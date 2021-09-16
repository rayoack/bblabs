import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Users, Fields } from '../entities';
import { saveInterestsDto } from './dto/save-interests.dto';

@Injectable()
export class UsersFactory {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  setInterestsForm = async (userToUpdate: Users, body: saveInterestsDto) => {
    userToUpdate.dedication_time = body.dedication_time;
    userToUpdate.goal_to_participate = body.goal_to_participate;

    if (body.fields && body.fields.length) {
      userToUpdate.fields = await this.getUsersFields(body.fields);
    }

    return userToUpdate;
  };

  private getUsersFields = async (ids: number[]) => {
    const selectedFields = await this.connection
      .getRepository(Fields)
      .createQueryBuilder()
      .where(`id IN (${ids})`)
      .getMany();
    return selectedFields;
  };
}
