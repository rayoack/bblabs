// import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
// import { Base } from './base.entity';
// import { DeliverablesStages } from './deliverables-stages.entity';
// import { SquadDeliverablesAttachments } from './squad-deliverables-attachments.entity';
// import { Squad } from './squad.entity';

// @Entity()
// export class SquadDeliverables extends Base {
//   @OneToMany(
//     () => SquadDeliverablesAttachments,
//     (attachments) => attachments.squadDeliverables,
//   )
//   attachments: SquadDeliverablesAttachments[];

//   @ManyToOne(() => Squad, (squad) => squad.deliverables)
//   squad: Squad;

//   @ManyToOne(
//     () => DeliverablesStages,
//     (deliverablesStage) => deliverablesStage.squadDeliverables,
//   )
//   stage: DeliverablesStages;
// }
