import {
  ContestChallenges,
  ProfessionalsType,
  Users,
} from '../../../src/domain/entities';
import { SquadToUser } from '../../../src/domain/entities/squad-to-user.entity';
import { Squad } from '../../../src/domain/entities/squad.entity';
import { CreateSquadDto } from '../../../src/domain/squad/dto/create-squad.dto';

export const createSquadToUser = (
  creator: Users,
  professionalType: ProfessionalsType,
) => {
  const squadToUser = new SquadToUser();
  squadToUser.professionalType = professionalType;
  squadToUser.user = creator;
  return squadToUser;
};

export const createSquad = (
  body: CreateSquadDto,
  contestChallenge: ContestChallenges,
  creator: Users,
  squadToUser: SquadToUser,
) => {
  const squad = new Squad();
  squad.name = body.name;
  squad.description = body.description;
  squad.creator = creator;
  squad.contestChallenge = contestChallenge;
  squad.squadToUser = [squadToUser];
  return squad;
};
