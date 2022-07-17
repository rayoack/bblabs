// import {
//     Column,
//     Entity,
//     JoinColumn,
//     JoinTable,
//     ManyToMany,
//     OneToMany,
//     OneToOne,
//   } from 'typeorm';
//   import { ActivitiesUsers } from './activities_users.entity';
//   import { Attachments } from './attachments.entity';
//   import { Base } from './base.entity';
//   import { Profiles } from './profiles.entity';

//   @Entity()
//   export class Activities extends Base {
//     @Column({ nullable: true })
//     name: string;

//     @Column({ unique: true })
//     email: string;

//     @Column({ nullable: true, unique: true })
//     document: string;

//     @Column({ nullable: true })
//     phone: string;

//     @Column({ nullable: true })
//     password_digest: string;

//     @Column({ default: false })
//     reset_password: boolean;

//     @Column({ default: 0 })
//     status: number;

//     @Column({ nullable: true })
//     attachment_id: number;

//     @Column({ nullable: true })
//     profile_id: number;

//     @Column({ nullable: true })
//     deleted_at: Date;

//     @Column({ nullable: true })
//     confirmation_code: string;

//     @OneToOne(() => Attachments)
//     @JoinColumn({ name: 'attachment_id' })
//     attachment: Attachments;

//     @OneToOne(() => Profiles)
//     @JoinColumn({ name: 'profile_id' })
//     profile: Profiles;

//     @OneToMany(() => ActivitiesUsers, (activity) => activity.users)
//     activity_users: ActivitiesUsers[];
//   }
