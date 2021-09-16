import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSquadDto } from './dto/create-squad.dto';
import { JoinSquadDto } from './dto/join-squad.dto';
import {
  SquadDeliverablesAttachmentDto,
  SquadDeliverablesDto,
} from './dto/squad-deliverables.dto';
import { UpdateSquadDto } from './dto/update-squad.dto';
import { SquadDeliverablesAggregate } from './squad-deliverables.aggregate';
import { SquadService } from './squad.service';

@Controller('squads')
export class SquadController {
  constructor(
    private readonly squadService: SquadService,
    private readonly squadDeliverablesAggregate: SquadDeliverablesAggregate,
  ) {}

  @Post('contest-challenge/:contestChallengeId')
  async createNewSquad(
    @Param('contestChallengeId') contestChallengeId: number,
    @Body() newSquadDto: CreateSquadDto,
    @Req() req,
  ) {
    return this.squadService.createNewSquad(
      contestChallengeId,
      req.user,
      newSquadDto,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.squadService.findOne(id);
  }

  @Post('join')
  async joinTheSquad(@Body() joinSquadDto: JoinSquadDto, @Req() req) {
    return this.squadService.joinTheSquad(joinSquadDto, req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('contest-challenge/:contestChallengeId')
  async findAll(
    @Param('contestChallengeId') contestChallengeId: number,
    @Req() req,
  ) {
    return await this.squadService.findAll(contestChallengeId, req.user);
  }

  @Delete(':squadId/user')
  async leaveTheSquad(@Param('squadId') squadId: number, @Req() req) {
    return await this.squadService.leaveTheSquad(squadId, req.user);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSquadDto: UpdateSquadDto,
  ) {
    return await this.squadService.update(id, updateSquadDto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/deliverables/upload')
  async uploadFiles(
    @Param('id') id: string,
    @Body() deliverables: SquadDeliverablesDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SquadDeliverablesAttachmentDto> {
    return await this.squadService.uploadFile(id, deliverables, file);
  }

  @Post(':id/deliverables')
  async sendDeliverables(
    @Param('id') id: string,
    @Body() deliverables: SquadDeliverablesDto,
    @Req() req,
  ) {
    return await this.squadService.sendDeliverables(id, req.user, deliverables);
  }

  @Get(':id/challenges/:challengeId/deliverables')
  async getDeliverables(
    @Param('id') id: string,
    @Param('challengeId') challengeId: number,
  ) {
    return await this.squadDeliverablesAggregate.getDeliverables(
      id,
      challengeId,
    );
  }

  @Delete(':id/deliverables/:stage')
  async removeDeliverables(
    @Param('id') id: string,
    @Param('stage') stageId: number,
  ) {
    return await this.squadService.removeDeliverables(id, stageId);
  }
}
