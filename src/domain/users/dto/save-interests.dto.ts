import { ApiProperty } from '@nestjs/swagger';

export class saveInterestsDto {
  @ApiProperty()
  dedication_time: string;

  @ApiProperty()
  goal_to_participate: string;

  @ApiProperty()
  fields: number[];
}
