import { ContestChallengesController } from '../../../src/domain/contest-challenges/contest-challenges.controller';
import { CreateContestChallengeDto } from '../../../src/domain/contest-challenges/dto/create-contest-challenge.dto';
import { UpdateContestChallengeDto } from '../../../src/domain/contest-challenges/dto/update-contest-challenge.dto';
import { constestChallengeServiceMock } from '../../__helpers__/contest-challenge.service.mock';

const createChallengeMock: CreateContestChallengeDto =
  new CreateContestChallengeDto();
const updateChallengeMock: UpdateContestChallengeDto =
  new UpdateContestChallengeDto();

describe('ContestChallengesController', () => {
  describe('when the create method is called', () => {
    it('should to call the create method from ContestChallengesService', async () => {
      const createChallenge = spyOn(constestChallengeServiceMock, 'create');
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).create(createChallengeMock);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(createChallenge).toHaveBeenCalledWith(createChallengeMock);
    });
  });

  describe('when the index method is called', () => {
    it('should to call the findAll method from ContestChallengesService', async () => {
      const findAllChallenges = spyOn(constestChallengeServiceMock, 'findAll');
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).findAll(
          { url: '/contest-challenge' },
          'coming_soon,squad_formation,in_progress',
          10,
          1,
        );
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(findAllChallenges).toHaveBeenCalledWith(
        {
          limit: 10,
          page: 1,
          route: '/contest-challenge',
        },
        'coming_soon,squad_formation,in_progress',
      );
    });

    describe('when any arguments has passed', () => {
      it('should to use the default arguments', async () => {
        const findAllChallenges = spyOn(
          constestChallengeServiceMock,
          'findAll',
        );
        let err: Error;
        try {
          await new ContestChallengesController(
            constestChallengeServiceMock,
          ).findAll(
            { url: '/contest-challenge' },
            'coming_soon,squad_formation,in_progress',
          );
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(findAllChallenges).toHaveBeenCalledWith(
          {
            limit: 10,
            page: 1,
            route: '/contest-challenge',
          },
          'coming_soon,squad_formation,in_progress',
        );
      });
    });
  });

  describe('when the findOne method is called', () => {
    it('should to call the findOne method from ContestChallengesService', async () => {
      const findOneChallenge = spyOn(constestChallengeServiceMock, 'findOne');
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).findOne();
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(findOneChallenge).toHaveBeenCalledWith(null);
    });
  });

  describe('when the countChallengesByStatus method is called', () => {
    it('should to call the countChallengesByStatus method from ContestChallengesService', async () => {
      const countChallengesByStatus = spyOn(
        constestChallengeServiceMock,
        'countChallengesByStatus',
      );
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).countChallengesByStatus();
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(countChallengesByStatus).toHaveBeenCalled();
    });
  });

  describe('when the update method is called', () => {
    it('should to call the update method from ContestChallengesService', async () => {
      const updateChallenge = spyOn(constestChallengeServiceMock, 'update');
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).update(1, updateChallengeMock);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(updateChallenge).toHaveBeenCalledWith(1, updateChallengeMock);
    });
  });

  describe('when the delete method is called', () => {
    it('should to call the delete method from ContestChallengesService', async () => {
      const deleteChallenge = spyOn(constestChallengeServiceMock, 'delete');
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).remove(1);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(deleteChallenge).toHaveBeenCalledWith(1);
    });
  });

  describe('when the updateStatus method is called', () => {
    it('should to call the updateStatus method from ContestChallengesService', async () => {
      const updateStatus = spyOn(constestChallengeServiceMock, 'updateStatus');
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).updateStatus(1, 'open');
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(updateStatus).toHaveBeenCalledWith(1, 'open');
    });
  });

  describe('when the findChallengesByUser method is called', () => {
    it('should to call the findChallengesByUser method from ContestChallengesService', async () => {
      const findChallengesByUser = spyOn(
        constestChallengeServiceMock,
        'findChallengesByUser',
      );
      let err: Error;
      try {
        await new ContestChallengesController(
          constestChallengeServiceMock,
        ).findChallengesByUser('1');
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(findChallengesByUser).toHaveBeenCalledWith('1');
    });
  });
});
