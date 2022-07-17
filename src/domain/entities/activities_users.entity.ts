import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { Users } from './user.entity';

@Entity()
export class ActivitiesUsers extends Base {
  @Column()
  user_id: number;

  @Column()
  activity_id: number;

  @ManyToOne(() => Users, (activity) => activity.activity_users)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  // @ManyToOne(() => Users, (user) => user.activity_users)
  // @JoinColumn([{ name: 'activity_id', referencedColumnName: 'id' }])
  // activity: Users;
}
