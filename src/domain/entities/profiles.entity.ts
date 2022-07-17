import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Profiles extends Base {
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  kind: string;
}
