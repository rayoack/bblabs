import { ApiProperty } from '@nestjs/swagger';

export class ChallengeResultsRankByTrophiesDto {
  @ApiProperty()
  squadId: string;

  @ApiProperty()
  contestChallengeId: number;

  @ApiProperty()
  trophyType: string;

  @ApiProperty()
  votes: number;

  @ApiProperty()
  position?: number;
}
