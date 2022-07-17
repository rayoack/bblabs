// import { Module } from '@nestjs/common';
// import { SquadService } from './squad.service';
// import { SquadController } from './squad.controller';
// import { Squad } from '../entities/squad.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { DeliverablesStages, ProfessionalsType, Users } from '../entities';
// import { ContestChallengesModule } from '../contest-challenges/contest-challenges.module';
// import { SquadFactory } from './squad.factory';
// import { UpdateContactListener } from './listeners/update-contact.listener';
// import { IntegrationModule } from 'src/integrations/integrations.module';
// import { SquadToUser } from '../entities/squad-to-user.entity';
// import { SquadDeliverablesAggregate } from './squad-deliverables.aggregate';

// @Module({
//   imports: [
//     IntegrationModule,
//     ContestChallengesModule,
//     TypeOrmModule.forFeature([
//       Squad,
//       SquadToUser,
//       Users,
//       ProfessionalsType,
//       DeliverablesStages,
//     ]),
//   ],
//   providers: [
//     SquadService,
//     SquadFactory,
//     UpdateContactListener,
//     SquadDeliverablesAggregate,
//   ],
//   controllers: [SquadController],
// })
// export class SquadModule {}
