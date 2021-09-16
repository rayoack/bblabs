import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VoteInSquadDto {
  @ApiProperty()
  @IsNotEmpty()
  squadId: string;

  @ApiProperty()
  @IsNotEmpty()
  contestChallengeId: number;

  @ApiProperty()
  @IsNotEmpty()
  trophyTypeId: number;
}
