import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfessionalsType } from './professionals-type.entity';
import { Squad } from './squad.entity';
import { Users } from './user.entity';

@Entity()
export class SquadToUser {
  @PrimaryGeneratedColumn()
  squadToUser: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'included_at' })
  includedAt?: Date;

  @ManyToOne(
    () => ProfessionalsType,
    (professionalsType) => professionalsType.squadsToUser,
  )
  professionalType: ProfessionalsType;

  @ManyToOne(() => Squad, (squad) => squad.squadToUser)
  squad: Squad;

  @ManyToOne(() => Users, (squad) => squad.squadToUser)
  user: Users;
}
