import {
  ContestChallenges,
  DeliverablesStages,
} from '../../../src/domain/entities';

export const createContestChallenge = (
  contestChallengesProfessionalsType?: any[],
  status = 'squad_formation',
): ContestChallenges => ({
  id: 1,
  status: status,
  title: 'title',
  context: 'context',
  headline: 'headline',
  startDate: new Date(),
  endDate: new Date(),
  goal: 'goal',
  deliverable: 'deliverable',
  fields: [],
  professionalsType: [],
  squads: [],
  votes: [],
  challengeResults: [],
  wallpaperUrl: '',
  contestChallengesProfessionalsType: contestChallengesProfessionalsType ?? [],
  deliverablesStages: [new DeliverablesStages()],
});
