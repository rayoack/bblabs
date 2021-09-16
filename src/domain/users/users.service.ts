import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnexpectedException } from '../../exceptions/unexpected.exception';
import { UserRepository } from './users.repository';
import { Users } from '../entities';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { UsersFactory } from './users.factory';
import { saveInterestsDto } from './dto/save-interests.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: UserRepository,
    private readonly usersFactory: UsersFactory,
  ) {}

  async setMemberOfLabsCommunity(req) {
    try {
      const bboxUser = await this.userRepository.findOne({
        bbox_id: req.user._id,
      });
      return await this.userRepository.update(bboxUser.id, {
        is_member_of_labs_community: true,
      });
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-active-notfied-user',
        'users.service.setMemberOfLabsCommunity',
        err,
      );
    }
  }

  async saveInterests(body: saveInterestsDto, id: string): Promise<Users> {
    try {
      let user = await this.userRepository.findOne({
        bbox_id: id,
      });

      if (!user) {
        throw new EntityNotFoundException(
          'unexpeced-error-save-interests',
          'users.service.saveInterests',
          id,
        );
      }

      user = await this.usersFactory.setInterestsForm({ ...user }, body);

      return await this.userRepository.save(user);
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-save-interests',
        'users.service.saveInterests',
        err,
      );
    }
  }

  async findOne(user): Promise<Users> {
    try {
      const userFound = await this.userRepository.findOne({
        bbox_id: user._id,
      });

      if (!userFound) {
        const newUser = {
          bbox_id: user._id,
          email: user.email,
          name: user.fullName,
          notified: false,
        };

        return await this.userRepository.save(newUser);
      } else {
        return userFound;
      }
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-find-one-user',
        'users.service.findOne',
        user._id,
      );
    }
  }
}
