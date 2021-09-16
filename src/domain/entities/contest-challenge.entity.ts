import { Transform } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { ChallengesResults } from './challenges-results.entity';
import { ContestChallengesProfessionalsType } from './contest-challenges-professionals-type.entity';
import { DeliverablesStages } from './deliverables-stages.entity';
import { Fields } from './field.entity';
import { ProfessionalsType } from './professionals-type.entity';
import { Squad } from './squad.entity';
import { Votes } from './vote.entity';

export enum ContestChallengesStatusEnum {
  'coming_soon',
  'squad_formation',
  'in_progress',
  'in_voting',
  'completed',
}

@Entity()
export class ContestChallenges extends Base {
  @Column({ default: 'open' })
  public status: string;

  @Column()
  public title: string;

  @Column()
  public context: string;

  @Column()
  public headline: string;

  @Column({ name: 'start_date' })
  public startDate: Date;

  @Column({ name: 'end_date' })
  public endDate: Date;

  @Column()
  public goal: string;

  @Column()
  public deliverable: string;

  @Column({ nullable: true })
  public wallpaperUrl: string;

  @ManyToMany(() => ProfessionalsType)
  @JoinTable({ name: 'contest_challenges_professionals_type' })
  professionalsType: ProfessionalsType[];

  @OneToMany(
    () => ContestChallengesProfessionalsType,
    (contestChallengesProfessionalsType) =>
      contestChallengesProfessionalsType.contestChallenge,
  )
  @Transform((tr) =>
    tr.value.map((cpt) => ({ amount: cpt.amount, ...cpt.professionalsType })),
  )
  contestChallengesProfessionalsType: ContestChallengesProfessionalsType[];

  @ManyToMany(() => Fields)
  @JoinTable({ name: 'contest_challenges_fields' })
  fields: Fields[];

  @OneToMany(() => Squad, (squad) => squad.contestChallenge)
  squads: Squad[];

  @OneToMany(() => Votes, (votes) => votes.contestChallenge)
  votes: Votes[];

  @OneToMany(() => ChallengesResults, (results) => results.contestChallenge)
  challengeResults: ChallengesResults[];

  @ManyToMany(() => DeliverablesStages)
  @JoinTable({ name: 'contest_challenges_deliverables_stages' })
  deliverablesStages: DeliverablesStages[];
}
