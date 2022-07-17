// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   Query,
//   Req,
//   ClassSerializerInterceptor,
//   UseInterceptors,
// } from '@nestjs/common';
// import { VoteInSquadDto } from './dto/vote-in-squad.dto';
// import { VotesService } from './votes.service';

// @Controller('votes')
// export class VotesController {
//   constructor(private readonly votesService: VotesService) {}

//   @Post()
//   async voteInSquadToTrophy(
//     @Body() voteInSquadDto: VoteInSquadDto,
//     @Req() req,
//   ) {
//     return this.votesService.voteInSquadToTrophy(req.user, voteInSquadDto);
//   }

//   @Delete('contest-challenges/:contestChallengeId/trophy-type/:trophyTypeId')
//   async removeSquadVote(
//     @Param('contestChallengeId') contestChallengeId: number,
//     @Param('trophyTypeId') trophyTypeId: number,
//     @Req() req,
//   ) {
//     return await this.votesService.removeSquadVote(
//       contestChallengeId,
//       trophyTypeId,
//       req.user,
//     );
//   }

//   @UseInterceptors(ClassSerializerInterceptor)
//   @Get('user/contest-challenges/:contestChallengeId')
//   async getUserVotes(
//     @Param('contestChallengeId') contestChallengeId: number,
//     @Query() query,
//     @Req() req,
//   ) {
//     return await this.votesService.getUserVotes(
//       contestChallengeId,
//       req.user,
//       query.action,
//     );
//   }

//   @Get('ranking/contest_challenge/:challengeId/trophy_type/:trophyType')
//   async getChallengeRanking(
//     @Param('challengeId') challengeId: number,
//     @Param('trophyType') trophyType: number,
//   ) {
//     return await this.votesService.getChallengeRanking(challengeId, trophyType);
//   }
// }
