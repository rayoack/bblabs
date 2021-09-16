import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestChallenges, Squad, Users, Votes } from '../entities';
import { ContestChallengesController } from './contest-challenges.controller';
import { ContestChallengesFactory } from './contest-challenges.factory';
import { ContestChallengesService } from './contest-challenges.service';
import { IntegrationModule } from '../../integrations/integrations.module';
import { VotesService } from '../votes/votes.service';
import { BossaboxApiService } from '../../integrations/bossabox-api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContestChallenges, Users, Votes, Squad]),
    IntegrationModule,
  ],
  controllers: [ContestChallengesController],
  providers: [
    ContestChallengesService,
    ContestChallengesFactory,
    VotesService,
    BossaboxApiService,
  ],
  exports: [ContestChallengesService],
})
export class ContestChallengesModule {}
