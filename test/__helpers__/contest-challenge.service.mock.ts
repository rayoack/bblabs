// import { ContestChallengesRepository } from '../../src/domain/contest-challenges/contest-challenges.repository';
// import { CreateContestChallengeDto } from '../../src/domain/contest-challenges/dto/create-contest-challenge.dto';
// import { UpdateContestChallengeDto } from '../../src/domain/contest-challenges/dto/update-contest-challenge.dto';
// import { ContestChallengesProfessionalsType } from './../../src/domain/entities/contest-challenges-professionals-type.entity';
// import { connection } from './connection.mock';

// export const constestChallengeProfessionalsTypeMock: ContestChallengesProfessionalsType =
//   new ContestChallengesProfessionalsType();

// export const createChallengeMock = {
//   context: 'context2',
//   deliverable: 'deliverable2',
//   endDate: new Date(2),
//   startDate: new Date(2),
//   fields: [1],
//   goal: 'goal2',
//   headline: 'headline2',
//   professionalsAmount: [constestChallengeProfessionalsTypeMock],
//   status: 'open2',
//   title: 'title2',
// };

// export const contestChallengesRepository: ContestChallengesRepository =
//   new ContestChallengesRepository();
// export const contestChallengesFactory: any = {
//   connection: connection(),
//   setNewContestChallenge: jest.fn().mockReturnValue({
//     ...createChallengeMock,
//   }),
//   updateContestChallenge: jest.fn(),
//   setNewContestChallengeProfessionalType: jest.fn(),
// };

// export const constestChallengeServiceMock: any = {
//   contestChallengesFactory,
//   contestChallengesRepository,
//   create: jest.fn(),
//   delete: jest.fn(),
//   findAll: jest.fn(),
//   findOne: jest.fn(),
//   update: jest.fn(),
//   findChallengesByUser: jest.fn(),
//   updateStatus: jest.fn(),
//   countChallengesByStatus: jest.fn(),
// };

// export const contestChallengeDto = (
//   fields = [1],
// ): CreateContestChallengeDto => ({
//   context: 'context',
//   deliverable: 'deliverable',
//   endDate: new Date(),
//   startDate: new Date(),
//   fields,
//   goal: 'goal',
//   headline: 'headline',
//   professionalsAmount: [constestChallengeProfessionalsTypeMock],
//   status: 'open',
//   title: 'title',
//   wallpaperUrl: 'http://www.wallpaperurl.com',
//   deliverablesStages: [1],
// });

// export const updateContestChallengeDto = (
//   fields = [12],
// ): UpdateContestChallengeDto => ({
//   context: 'context2',
//   deliverable: 'deliverable2',
//   endDate: new Date(2),
//   startDate: new Date(2),
//   fields,
//   goal: 'goal2',
//   headline: 'headline2',
//   professionalsAmount: [constestChallengeProfessionalsTypeMock],
//   status: 'open2',
//   title: 'title2',
//   wallpaperUrl: 'http://www.wallpaperurl.com',
//   deliverablesStages: [1],
// });
