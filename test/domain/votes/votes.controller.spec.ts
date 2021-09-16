import { VoteInSquadDto } from '../../../src/domain/votes/dto/vote-in-squad.dto';
import { VotesController } from '../../../src/domain/votes/votes.controller';
import { squadDeliverablesAggregatesMock } from '../../__helpers__/squad-deliverable-aggregate.mock';
import { voteServiceMock } from '../../__helpers__/vote-service.mock';

const squadDeliverablesMock = squadDeliverablesAggregatesMock();

describe('VotesController', () => {
  describe('when voteInSquadToTrophy is called', () => {
    it('should to call the voteInSquadToTrophy from the VotesService', async () => {
      let err: Error;
      const voteService = voteServiceMock();
      const voteInSquadToTrophySpy = jest.spyOn(
        voteService,
        'voteInSquadToTrophy',
      );
      const controller = new VotesController(voteService);
      const voteInSquadDto: VoteInSquadDto = {
        squadId: 'squadId',
        contestChallengeId: 1,
        trophyTypeId: 1,
      };
      try {
        await controller.voteInSquadToTrophy(voteInSquadDto, { user: 1 });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(voteInSquadToTrophySpy).toHaveBeenCalledWith(1, voteInSquadDto);
    });
  });
  describe('when removeSquadVote is called', () => {
    it('should to call the removeSquadVote from the VotesService', async () => {
      let err: Error;
      const voteService = voteServiceMock();
      const removeSquadVoteSpy = jest.spyOn(voteService, 'removeSquadVote');
      const controller = new VotesController(voteService);
      try {
        await controller.removeSquadVote(1, 1, { user: 1 });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(removeSquadVoteSpy).toHaveBeenCalledWith(1, 1, 1);
    });
  });
  describe('when getUserVotes is called', () => {
    it('should to call the getUserVotes from the VotesService', async () => {
      let err: Error;
      const voteService = voteServiceMock();
      const getUserVotesSpy = jest.spyOn(voteService, 'getUserVotes');
      const controller = new VotesController(voteService);
      try {
        await controller.getUserVotes(1, { action: 'votes' }, { user: 1 });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(getUserVotesSpy).toHaveBeenCalledWith(1, 1, 'votes');
    });
  });
  describe('when getChallengeRanking is called', () => {
    it('should to call the getChallengeRanking from the VotesService', async () => {
      let err: Error;
      const voteService = voteServiceMock();
      const getUserVotesSpy = jest.spyOn(voteService, 'getChallengeRanking');
      const controller = new VotesController(voteService);
      try {
        await controller.getChallengeRanking(1, 1);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(getUserVotesSpy).toHaveBeenCalledWith(1, 1);
    });
  });
});
