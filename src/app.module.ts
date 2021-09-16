import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ContestChallengesModule } from './domain/contest-challenges/contest-challenges.module';
import { DatabaseExceptionFilter } from './exceptions/filters/database-exception.filter';
import { HttpExceptionFilter } from './exceptions/filters/http-exception.filter';
import { UsersModule } from './domain/users/users.module';
import { FieldsModule } from './domain/fields/fields.module';
import { SquadModule } from './domain/squad/squad.module';
import { ContestChallengesProfessionalsTypeModule } from './domain/contest-challenges-professionals-type/contest-challenges-professionals-type.module';
import { VacanciesModule } from './domain/vacancies/vacancies.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { VotesModule } from './domain/votes/votes.module';
import { ChallengesResultsModule } from './domain/challenges-results/challenges-results.module';

@Module({
  imports: [
    DatabaseModule,
    ContestChallengesModule,
    AuthModule,
    UsersModule,
    FieldsModule,
    ContestChallengesProfessionalsTypeModule,
    SquadModule,
    VacanciesModule,
    EventEmitterModule.forRoot(),
    VotesModule,
    ChallengesResultsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
