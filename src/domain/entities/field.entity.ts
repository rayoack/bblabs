import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Fields extends Base {
  @PrimaryColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public icon: string;
}
