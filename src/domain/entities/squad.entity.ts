// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   Generated,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Expose, Transform } from 'class-transformer';
// import { ContestChallenges } from './contest-challenge.entity';
// import { SquadToUser } from './activities_users.entity';
// import { Users } from './user.entity';
// import { Vacancies } from './vacancy.entity';
// import { SquadDeliverables } from './squad-deliverables.entity';
// import { Votes } from './vote.entity';
// import { ChallengesResults } from './challenges-results.entity';

// @Entity()
// export class Squad {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
//   public createdAt?: Date;

//   @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
//   public updatedAt?: Date;

//   @Column()
//   @Generated(`increment`)
//   number?: number;

//   @Column({ length: 25 })
//   name: string;

//   @Column({ length: 155 })
//   description: string;

//   @Column()
//   contestChallengeId: number;

//   @ManyToOne(() => ContestChallenges, (challenges) => challenges.squads)
//   contestChallenge: ContestChallenges;

//   @OneToMany(() => SquadToUser, (squadToUser) => squadToUser.squad)
//   @Transform((tr) =>
//     tr.value.map((squadToUser) => ({
//       ...squadToUser.user,
//       professionalType: squadToUser?.professionalType?.name,
//     })),
//   )
//   squadToUser: SquadToUser[];

//   @OneToMany(() => Vacancies, (vacancies) => vacancies.squad)
//   @Transform((tr) =>
//     tr.value
//       .filter((vacancy) => vacancy.amount > 0)
//       .map((vacancy) => ({
//         amount: vacancy.amount,
//         ...vacancy.professionalType,
//       })),
//   )
//   vacancies: Vacancies[];

//   @OneToMany(() => SquadDeliverables, (deliverables) => deliverables.squad)
//   deliverables: SquadDeliverables[];

//   @OneToMany(() => Votes, (votes) => votes.squad)
//   votes: Votes[];

//   @OneToMany(() => ChallengesResults, (results) => results.squad)
//   challengeResults: ChallengesResults[];

//   @Expose()
//   get isComplete(): boolean {
//     return (
//       this.vacancies && this.vacancies.every((vacancy) => vacancy.amount < 1)
//     );
//   }

//   isUserSquad: boolean;

//   userIsCreator: boolean;
// }
