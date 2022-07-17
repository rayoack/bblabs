// import { Transform } from 'class-transformer';
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { ContestChallenges } from './contest-challenge.entity';
// import { Squad } from './squad.entity';
// import { Users } from './user.entity';

// export enum TrophyTypes {
//   'better_solution',
//   'better_discovery',
//   'cleaner_code',
//   'better_ux_ui',
// }

// @Entity()
// export class Votes {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'included_at' })
//   includedAt?: Date;

//   @Column({
//     type: 'enum',
//     enum: TrophyTypes,
//   })
//   @Transform((tr) => ({
//     id: tr.value,
//     name: TrophyTypes[tr.value],
//   }))
//   trophyType: TrophyTypes;

//   @Column()
//   contestChallengeId: number;

//   @Column()
//   squadId: string;

//   @Column()
//   userId: number;

//   @ManyToOne(
//     () => ContestChallenges,
//     (contestChallenge) => contestChallenge.votes,
//   )
//   @JoinColumn([{ name: 'contestChallengeId', referencedColumnName: 'id' }])
//   contestChallenge: ContestChallenges;

//   @ManyToOne(() => Squad, (squad) => squad.votes)
//   @JoinColumn([{ name: 'squadId', referencedColumnName: 'id' }])
//   squad: Squad;

//   @ManyToOne(() => Users, (user) => user.votes)
//   @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
//   user: Users;
// }
