// import { Column, Entity, ManyToOne } from 'typeorm';
// import { Base } from './base.entity';
// import { SquadDeliverables } from './squad-deliverables.entity';
// import { Users } from './user.entity';

// @Entity()
// export class SquadDeliverablesAttachments extends Base {
//   constructor(
//     name?: string,
//     url?: string,
//     type?: string,
//     squadDeliverables?: SquadDeliverables,
//     creator?: Users,
//   ) {
//     super();
//     this.name = name;
//     this.url = url;
//     this.type = type;
//     this.squadDeliverables = squadDeliverables;
//     this.creator = creator;
//   }

//   @Column()
//   name: string;

//   @Column()
//   url: string;

//   @Column()
//   type: string;

//   @ManyToOne(() => SquadDeliverables, (squad) => squad.attachments)
//   squadDeliverables: SquadDeliverables;

//   @ManyToOne(() => Users, (user) => user.deliverablesAttachments)
//   creator: Users;
// }
