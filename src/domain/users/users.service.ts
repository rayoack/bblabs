import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnexpectedException } from '../../exceptions/unexpected.exception';
import { UserRepository } from './users.repository';
import { Users } from '../entities';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: UserRepository,
  ) {}

  async findOne(user) {
    try {
      return user;
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-find-one-user',
        'users.service.findOne',
        user._id,
      );
    }
  }

  async findAll(
    options: IPaginationOptions<any>,
    created_between: string,
    name: string,
  ): Promise<Pagination<Users>> {
    try {
      return await paginate<Users>(this.usersRepository, options, {
        order: { id: 'ASC' },
        relations: ['attachment', 'profile'],
        // where: { status: In(status.split(',')) },
      });
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-find-all-challenges',
        'contest-challenges.service.findAll',
        err,
      );
    }
  }
}
