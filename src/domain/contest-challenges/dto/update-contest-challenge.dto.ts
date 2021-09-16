import { PartialType } from '@nestjs/swagger';
import { CreateContestChallengeDto } from './create-contest-challenge.dto';

export class UpdateContestChallengeDto extends PartialType(
  CreateContestChallengeDto,
) {}
