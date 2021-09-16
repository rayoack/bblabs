import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { ContestChallenges } from './contest-challenge.entity';
import { Squad } from './squad.entity';
import { TrophyTypes } from './vote.entity';

@Entity()
export class ChallengesResults extends Base {
  @Column()
  squadId: string;

  @Column()
  contestChallengeId: number;

  @Column({
    type: 'enum',
    enum: TrophyTypes,
  })
  trophyType: TrophyTypes;

  @Column()
  votes: number;

  @Column()
  position: number;

  @ManyToOne(
    () => ContestChallenges,
    (contestChallenge) => contestChallenge.challengeResults,
  )
  @JoinColumn([{ name: 'contestChallengeId', referencedColumnName: 'id' }])
  contestChallenge: ContestChallenges;

  @ManyToOne(() => Squad, (squad) => squad.challengeResults)
  @JoinColumn([{ name: 'squadId', referencedColumnName: 'id' }])
  squad: Squad;
}
