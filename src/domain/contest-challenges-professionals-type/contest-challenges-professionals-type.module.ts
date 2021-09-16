import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestChallengesProfessionalsType } from '../entities/contest-challenges-professionals-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContestChallengesProfessionalsType])],
})
export class ContestChallengesProfessionalsTypeModule {}
