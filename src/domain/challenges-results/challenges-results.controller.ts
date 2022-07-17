// import { Controller, Get, Param } from '@nestjs/common';
// import { ChallengesResultsService } from './challenges-results.service';

// @Controller('challenges-results')
// export class ChallengesResultsController {
//   constructor(
//     private readonly challengesResultsService: ChallengesResultsService,
//   ) {}

//   @Get('total-votes/:contestChallengeId')
//   async trophiesTotalVotesByChallenge(
//     @Param('contestChallengeId') contestChallengeId: number,
//   ) {
//     return await this.challengesResultsService.getTrophiesTotalVotesByChallenge(
//       contestChallengeId,
//     );
//   }
// }
