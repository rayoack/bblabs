import { ProfessionalsType } from '../../../src/domain/entities';

export const createAProfessionalType = (): ProfessionalsType => ({
  id: 1,
  name: `professionaltype name`,
  icon: `professional.svg`,
  squadsToUser: [],
  contestChallengesProfessionalsType: [],
  vacancies: [],
});
