import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Squad, Users, Votes } from '../entities';
import { VotesController } from './votes.controller';
import { VoteRepository } from './votes.repository';
import { VotesService } from './votes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Votes, Users, Squad])],
  controllers: [VotesController],
  providers: [VotesService, VoteRepository],
})
export class VotesModule {}
