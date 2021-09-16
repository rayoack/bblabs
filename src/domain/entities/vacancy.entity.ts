import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { ProfessionalsType } from './professionals-type.entity';
import { Squad } from './squad.entity';

@Entity()
export class Vacancies extends Base {
  @Column({ default: 0 })
  public amount: number;

  @ManyToOne(() => Squad, (squad) => squad.vacancies)
  squad: Squad;

  @ManyToOne(
    () => ProfessionalsType,
    (professionalsType) => professionalsType.vacancies,
  )
  professionalType: ProfessionalsType;
}
