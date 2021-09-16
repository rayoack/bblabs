import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Base } from './base.entity';
import { ContestChallengesProfessionalsType } from './contest-challenges-professionals-type.entity';
import { SquadToUser } from './squad-to-user.entity';
import { Vacancies } from './vacancy.entity';

@Entity({ name: 'professionals_type' })
export class ProfessionalsType extends Base {
  @PrimaryColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public icon: string;

  @OneToMany(
    () => ContestChallengesProfessionalsType,
    (contestChallengesProfessionalsType) =>
      contestChallengesProfessionalsType.professionalsType,
  )
  contestChallengesProfessionalsType: ContestChallengesProfessionalsType[];

  @OneToMany(() => SquadToUser, (squadToUser) => squadToUser.professionalType)
  squadsToUser: SquadToUser[];

  @OneToMany(() => Vacancies, (vacancies) => vacancies.professionalType)
  vacancies: Vacancies[];
}
