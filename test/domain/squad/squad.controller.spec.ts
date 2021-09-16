import { JoinSquadDto } from 'src/domain/squad/dto/join-squad.dto';
import { UpdateSquadDto } from 'src/domain/squad/dto/update-squad.dto';
import { CreateSquadDto } from '../../../src/domain/squad/dto/create-squad.dto';
import { SquadDeliverablesDto } from '../../../src/domain/squad/dto/squad-deliverables.dto';
import { SquadController } from '../../../src/domain/squad/squad.controller';
import { squadDeliverablesAggregatesMock } from '../../__helpers__/squad-deliverable-aggregate.mock';
import { squadServiceMock } from '../../__helpers__/squad-service.mock';

const squadDeliverablesMock = squadDeliverablesAggregatesMock();

describe('SquadController', () => {
  describe('when createNewSquad is called', () => {
    it('should to call the createNewSquad from the SquadService', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const createNewSquadSpy = jest.spyOn(squadService, 'createNewSquad');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      const newSquadDto: CreateSquadDto = {
        description: 'description',
        name: 'name',
        professionalTypeId: 1,
        slug: 'teste-profile-me',
        avatar: 'avatar-url',
      };
      try {
        await controller.createNewSquad(1, newSquadDto, { user: 1 });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(createNewSquadSpy).toHaveBeenCalledWith(1, 1, newSquadDto);
    });
  });
  describe('when joinTheSquad is called', () => {
    it('should to call the joinTheSquad from the SquadService', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const joinTheSquadSpy = jest.spyOn(squadService, 'joinTheSquad');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      const joinSquadDto: JoinSquadDto = {
        squadId: 1,
        professionalTypeId: 1,
        slug: 'teste-profile-me',
        avatar: 'avatar-url',
      };
      try {
        await controller.joinTheSquad(joinSquadDto, { user: 1 });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(joinTheSquadSpy).toHaveBeenCalledWith(joinSquadDto, 1);
    });
  });
  describe('when findOne is called', () => {
    it('should to call the findOne from the SquadService', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const findOneSpy = jest.spyOn(squadService, 'findOne');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      try {
        await controller.findOne(1);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(findOneSpy).toHaveBeenCalledWith(1);
    });
  });
  describe('when findAll is called', () => {
    it('should to call the findAll from the SquadService', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const findAllSpy = jest.spyOn(squadService, 'findAll');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      try {
        await controller.findAll(1, { user: 1 });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(findAllSpy).toHaveBeenCalledWith(1, 1);
    });
  });
  describe('when leaveTheSquad is called', () => {
    it('should to call the leaveTheSquad from the SquadService', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const leaveTheSquadSpy = jest.spyOn(squadService, 'leaveTheSquad');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      try {
        await controller.leaveTheSquad(1, { user: 1 });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(leaveTheSquadSpy).toHaveBeenCalledWith(1, 1);
    });
  });
  describe('when update is called', () => {
    it('should to call the update from the SquadService', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const updateSquadSpy = jest.spyOn(squadService, 'update');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      const updateSquadDto: UpdateSquadDto = {
        description: 'description',
        name: 'name',
      };
      try {
        await controller.update(1, updateSquadDto);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(updateSquadSpy).toHaveBeenCalledWith(1, updateSquadDto);
    });
  });

  describe('when uploadFiles is called', () => {
    it('should to call the uploadFile service', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const uploadFileSpy = jest.spyOn(squadService, 'uploadFile');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      try {
        await controller.uploadFiles('12345', new SquadDeliverablesDto(), null);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(uploadFileSpy).toHaveBeenCalledWith(
        '12345',
        new SquadDeliverablesDto(),
        null,
      );
    });
  });

  describe('when the sendDeliverables is called', () => {
    it('should to call the sendDeliverables service', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const sendDeliverablesSpy = jest.spyOn(squadService, 'sendDeliverables');
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      try {
        await controller.sendDeliverables('12345', new SquadDeliverablesDto(), {
          user: 1,
        });
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(sendDeliverablesSpy).toHaveBeenCalledWith(
        '12345',
        1,
        new SquadDeliverablesDto(),
      );
    });
  });

  describe('when getDeliverables is called', () => {
    it('should to call the getDeliverables squadDeliverablesAggregate', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const getDeliverablesSpy = jest.spyOn(
        squadDeliverablesMock,
        'getDeliverables',
      );
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      try {
        await controller.getDeliverables('12345', 1);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(getDeliverablesSpy).toHaveBeenCalledWith('12345', 1);
    });
  });

  describe('when removeDeliverables is called', () => {
    it('should to call the removeDeliverables squadService', async () => {
      let err: Error;
      const squadService = squadServiceMock();
      const removeDeliverablesSpy = jest.spyOn(
        squadService,
        'removeDeliverables',
      );
      const controller = new SquadController(
        squadService,
        squadDeliverablesMock,
      );
      try {
        await controller.removeDeliverables('12345', 1);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(removeDeliverablesSpy).toHaveBeenCalledWith('12345', 1);
    });
  });
});
