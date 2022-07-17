// import {
//   Body,
//   ClassSerializerInterceptor,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Put,
//   Query,
//   Req,
//   Request,
//   Res,
//   UseInterceptors,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { ContestChallengesStatusEnum } from '../entities/contest-challenge.entity';
// import { ContestChallengesService } from './contest-challenges.service';
// import { CreateContestChallengeDto } from './dto/create-contest-challenge.dto';
// import { UpdateContestChallengeDto } from './dto/update-contest-challenge.dto';
// import { Response } from 'express';
// @ApiBearerAuth()
// @ApiTags('contest-challenges')
// @Controller('contest-challenges')
// @UseInterceptors(ClassSerializerInterceptor)
// export class ContestChallengesController {
//   constructor(
//     private readonly contestChallengesService: ContestChallengesService,
//   ) {}

//   @Post()
//   async create(@Body() createContestChallengeDto: CreateContestChallengeDto) {
//     return await this.contestChallengesService.create(
//       createContestChallengeDto,
//     );
//   }

//   @Get('/all')
//   async findAll(
//     @Request() req,
//     @Query('status') status,
//     @Query('limit') limit = 10,
//     @Query('page') page = 1,
//   ) {
//     const defaultStatus = status
//       ? status
//       : `${ContestChallengesStatusEnum[0]},${ContestChallengesStatusEnum[1]},${ContestChallengesStatusEnum[2]}`;
//     return await this.contestChallengesService.findAll(
//       {
//         limit,
//         page,
//         route: req.url,
//       },
//       defaultStatus,
//     );
//   }

//   @Get()
//   async findOne(@Query('challengeId') challengeId = null) {
//     return await this.contestChallengesService.findOne(challengeId);
//   }

//   @Put(':id')
//   async update(
//     @Param('id') id: number,
//     @Body() updateContestChallengeDto: UpdateContestChallengeDto,
//   ) {
//     return await this.contestChallengesService.update(
//       id,
//       updateContestChallengeDto,
//     );
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number) {
//     return await this.contestChallengesService.delete(id);
//   }

//   @Get('/users/:bbox_id')
//   async findChallengesByUser(@Param('bbox_id') bbox_id: string) {
//     return await this.contestChallengesService.findChallengesByUser(bbox_id);
//   }

//   @Patch(':id/status/:status')
//   async updateStatus(
//     @Param('id') id: number,
//     @Param('status')
//     updatedStatus: string,
//   ) {
//     return await this.contestChallengesService.updateStatus(id, updatedStatus);
//   }

//   @Get('/status/count')
//   async countChallengesByStatus() {
//     return await this.contestChallengesService.countChallengesByStatus();
//   }

//   @Get('/community')
//   async joinToLabsCommunity(@Req() req, @Res() res: Response): Promise<void> {
//     const url = await this.contestChallengesService.joinToCommunity(req.user);
//     res.json({ url });
//   }
// }
