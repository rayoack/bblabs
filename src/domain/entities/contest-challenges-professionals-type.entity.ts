// import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { Base } from './base.entity';
// import { ContestChallenges } from './contest-challenge.entity';
// import { ProfessionalsType } from './professionals-type.entity';

// @Entity()
// export class ContestChallengesProfessionalsType extends Base {
//   @Column()
//   public contestChallengesId: number;

//   @Column()
//   public professionalsTypeId: number;

//   @Column({ default: 0 })
//   public amount: number;

//   @ManyToOne(
//     () => ContestChallenges,
//     (contestChallenge) => contestChallenge.contestChallengesProfessionalsType,
//   )
//   @JoinColumn([{ name: 'contestChallengesId', referencedColumnName: 'id' }])
//   contestChallenge: ContestChallenges;

//   @ManyToOne(
//     () => ProfessionalsType,
//     (professionalsType) => professionalsType.contestChallengesProfessionalsType,
//   )
//   @JoinColumn([{ name: 'professionalsTypeId', referencedColumnName: 'id' }])
//   professionalsType: ProfessionalsType;
// }
