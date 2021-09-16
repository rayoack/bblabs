import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Base } from './base.entity';
import { SquadDeliverables } from './squad-deliverables.entity';

@Entity()
export class DeliverablesStages extends Base {
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public expected_results: string;

  @Column()
  public url_guide: string;

  @Column()
  public icon_name: string;

  @OneToMany(
    () => SquadDeliverables,
    (squadDeliverables) => squadDeliverables.stage,
  )
  squadDeliverables: SquadDeliverables[];
}
