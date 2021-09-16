import { Injectable } from '@nestjs/common';
import {
  ContestChallenges,
  ProfessionalsType,
  Users,
  Vacancies,
} from '../entities';
import { ContestChallengesProfessionalsType } from '../entities/contest-challenges-professionals-type.entity';
import { SquadToUser } from '../entities/squad-to-user.entity';
import { Squad } from '../entities/squad.entity';
import { CreateSquadDto } from './dto/create-squad.dto';

@Injectable()
export class SquadFactory {
  setNewSquadToUser(
    creator: Users,
    professionalType: ProfessionalsType,
    squad: Squad,
  ) {
    const squadToUser = new SquadToUser();
    squadToUser.squad = squad;
    squadToUser.professionalType = professionalType;
    squadToUser.user = creator;
    return squadToUser;
  }

  setNewSquad(
    body: CreateSquadDto,
    contestChallenge: ContestChallenges,
    creator: Users,
  ) {
    const squad = new Squad();
    squad.name = body.name;
    squad.description = body.description;
    squad.creator = creator;
    squad.contestChallenge = contestChallenge;
    return squad;
  }

  setNewVacancies(
    challengeProfessionals: ContestChallengesProfessionalsType[],
    creatorProfessionalId: number,
    squad: Squad,
  ) {
    const vacancies = [];
    for (const challengeProfessional of challengeProfessionals) {
      const newVacancy = new Vacancies();
      newVacancy.squad = squad;
      newVacancy.professionalType = challengeProfessional.professionalsType;
      newVacancy.amount =
        creatorProfessionalId === challengeProfessional.id
          ? challengeProfessional.amount - 1
          : challengeProfessional.amount;
      vacancies.push(newVacancy);
    }
    return vacancies;
  }
}
