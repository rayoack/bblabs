import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Fields } from './field.entity';
import { SquadDeliverablesAttachments } from './squad-deliverables-attachments.entity';
import { SquadToUser } from './squad-to-user.entity';
import { Votes } from './vote.entity';

@Entity()
export class Users extends Base {
  @Column()
  bbox_id: string;

  @Column()
  email: string;

  @Column()
  is_member_of_labs_community: boolean;

  @Column({ nullable: true })
  goal_to_participate: string;

  @Column({ nullable: true })
  dedication_time: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => Fields)
  @JoinTable({ name: 'users_fields' })
  fields: Fields[];

  @OneToMany(() => SquadToUser, (squadToUser) => squadToUser.user)
  squadToUser: SquadToUser[];

  @OneToMany(
    () => SquadDeliverablesAttachments,
    (deliverables) => deliverables.creator,
  )
  deliverablesAttachments: SquadDeliverablesAttachments[];

  @OneToMany(() => Votes, (votes) => votes.user)
  votes: Votes[];
}
