import { createContestChallenge } from '../../__helpers__/factories/contest-challenge.factory';
import { DeliverablesStages, Squad, Users } from '../../../src/domain/entities';
import { SquadDeliverables } from '../../../src/domain/entities/squad-deliverables.entity';
import {
  SquadDeliverablesAttachmentDto,
  SquadDeliverablesDto,
} from '../../../src/domain/squad/dto/squad-deliverables.dto';
import { SquadDeliverablesAggregate } from '../../../src/domain/squad/squad-deliverables.aggregate';
import { UnexpectedException } from '../../../src/exceptions/unexpected.exception';
import { AwsStorageService } from '../../../src/integrations/aws-storage.service';
import { connection } from '../../__helpers__/connection.mock';
jest.mock('@aws-sdk/client-s3');

export const fileMock: Express.Multer.File = {
  originalname: 'orginal-name.test',
  filename: 'file-name.test',
  mimetype: 'test/test',
  buffer: Buffer.from('123'),
  fieldname: undefined,
  encoding: undefined,
  size: undefined,
  stream: undefined,
  destination: undefined,
  path: undefined,
};

export const deliverableStageMock = (name): DeliverablesStages => ({
  id: 1,
  name,
  description: '',
  expected_results: '',
  url_guide: '',
  icon_name: '',
  squadDeliverables: [new SquadDeliverables()],
});

describe('SquadDeliverablesAggregate', () => {
  describe('uploadFile', () => {
    let squadDeliverableAgregate: SquadDeliverablesAggregate;

    const title = 'file-test';
    const path = 'path/somewhere/test';

    beforeEach(() => {
      squadDeliverableAgregate = new SquadDeliverablesAggregate(null);
    });
    describe('when the upload is sucessfully', () => {
      it('should to return anSquadDeliverableAttachmentDto', async () => {
        let err: Error, result: SquadDeliverablesAttachmentDto;
        const awsStorageServiceMock = jest
          .spyOn(AwsStorageService.prototype, 'uploadFile')
          .mockResolvedValue('https://aws.s3.storage/bucket/squad/file.test');
        try {
          result = await squadDeliverableAgregate.uploadFile(
            fileMock,
            title,
            path,
          );
        } catch (error) {
          err = error;
        }
        expect(err).toBeUndefined();
        expect(awsStorageServiceMock).toHaveBeenCalled();
        expect(result).toEqual({
          name: `${title}.test`,
          url: 'https://aws.s3.storage/bucket/squad/file.test',
        });
      });
    });

    describe('when the upload throw an error', () => {
      it('should to catch the exception and throw an UnexpectedException', async () => {
        let err: Error;
        jest
          .spyOn(AwsStorageService.prototype, 'uploadFile')
          .mockRejectedValue(new Error());
        try {
          await squadDeliverableAgregate.uploadFile(fileMock, title, path);
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(
          new UnexpectedException(
            'send-squad-deliverables-attachments',
            'SquadDeliverablesAggregate.sendAttachments',
            new Error(),
          ),
        );
      });
    });
  });

  describe('removeDeliverables', () => {
    describe('when the deliverables is an array', () => {
      it('should to remove the folder', async () => {
        let err: Error;
        const squad = new Squad();
        const stage = deliverableStageMock('Exploração');
        const connectionMock = connection();
        const queryRunner = connectionMock.createQueryRunner();
        spyOn(queryRunner.manager.getRepository(), 'find').and.returnValue(
          Promise.resolve([{ stage, id: '123123' }]),
        );
        const removeFolderMock = spyOn(
          AwsStorageService.prototype,
          'removeFolder',
        );
        try {
          const aggregate = new SquadDeliverablesAggregate(connectionMock);
          await aggregate.removeDeliverables(squad, stage, queryRunner);
        } catch (error) {
          err = error;
        }
        expect(err).toBeUndefined();
        expect(removeFolderMock).toHaveBeenCalled();
      });
    });
  });

  describe('save', () => {
    let squadMock: Squad,
      creator: Users,
      connectionMock,
      squadDeliverableDto: SquadDeliverablesDto,
      squadDeliverableAgregate: SquadDeliverablesAggregate;
    beforeEach(() => {
      connectionMock = connection();
      squadDeliverableAgregate = new SquadDeliverablesAggregate(connectionMock);
      squadMock = new Squad();
      creator = new Users();
      squadDeliverableDto = {
        stageId: 1,
        attachments: [{ name: 'something', url: 'google', type: 'file' }],
      };
      jest
        .spyOn(connectionMock.createQueryRunner().manager, 'save')
        .mockReturnValueOnce({
          stage: deliverableStageMock('Exploração'),
          id: 1,
          attachments: [],
          squad: squadMock,
        });
      jest
        .spyOn(connectionMock.createQueryRunner().manager, 'save')
        .mockReturnValueOnce([{ name: 'name', url: 'url', type: 'type' }]);
    });

    describe('when the commit transaction is successfull', () => {
      it('should return the deliverables saved', async () => {
        let err: Error;
        jest
          .spyOn(connectionMock.createQueryRunner().manager, 'findOne')
          .mockReturnValueOnce(deliverableStageMock('Exploração'));
        const removeDeliverablesSpy = spyOn(
          squadDeliverableAgregate,
          'removeDeliverables',
        );
        try {
          await squadDeliverableAgregate.save(
            squadMock,
            creator,
            squadDeliverableDto,
          );
        } catch (error) {
          err = error;
        }
        expect(err).toBeUndefined();
        expect(removeDeliverablesSpy).toHaveBeenCalled();
      });
    });
    describe('when the commit transaction throw an error', () => {
      it('should throw the exception', async () => {
        let err: Error;
        jest
          .spyOn(connectionMock.createQueryRunner().manager, 'findOne')
          .mockReturnValueOnce(deliverableStageMock('Exploração'));
        const removeDeliverablesSpy = jest
          .spyOn(squadDeliverableAgregate, 'removeDeliverables')
          .mockRejectedValue(new Error());
        try {
          await squadDeliverableAgregate.save(
            squadMock,
            creator,
            squadDeliverableDto,
          );
        } catch (error) {
          err = error;
        }
        expect(err).toEqual(new Error());
        expect(removeDeliverablesSpy).toHaveBeenCalled();
      });
    });
  });

  describe('getDeliverables', () => {
    describe('when the squadDeliverable is not empty', () => {
      it('should to return an array of attachments', async () => {
        let err: Error, someData;
        const connectionMock = connection();
        jest
          .spyOn(
            connectionMock
              .getRepository()
              .createQueryBuilder()
              .innerJoinAndSelect()
              .leftJoinAndSelect()
              .where(),
            'getMany',
          )
          .mockResolvedValue([
            {
              stage: deliverableStageMock('Exploração'),
              attachments: [{ type: 'file' }, { type: 'link' }],
            },
            {
              stage: deliverableStageMock('Solução'),
              attachments: [{ type: 'file' }, { type: 'link' }],
            },
          ]);

        const contestChallengeMock = createContestChallenge();
        contestChallengeMock.deliverablesStages = [
          deliverableStageMock('Exploração'),
          deliverableStageMock('Solução'),
        ];
        jest
          .spyOn(
            connectionMock
              .getRepository()
              .createQueryBuilder()
              .leftJoinAndSelect()
              .where(),
            'getOne',
          )
          .mockResolvedValue(contestChallengeMock);
        const squadDeliverableAgregate = new SquadDeliverablesAggregate(
          connectionMock,
        );
        try {
          someData = await squadDeliverableAgregate.getDeliverables('', 1);
        } catch (error) {
          err = error;
        }
        expect(err).not.toBeDefined();
        expect(Array.isArray(someData)).toEqual(true);
      });
    });
  });

  describe('getNameFromFile', () => {
    describe('when the file has a originalName', () => {
      it('should to split for a dot and concat with the title', () => {
        const squadDeliverableAgregate = new SquadDeliverablesAggregate(null);
        const finalName = squadDeliverableAgregate.getNameFromFile(
          'my-test-file',
          fileMock,
        );
        expect(finalName).toEqual('my-test-file.test');
      });

      describe('when the the parameter title is null', () => {
        const squadDeliverableAgregate = new SquadDeliverablesAggregate(null);
        const finalName = squadDeliverableAgregate.getNameFromFile(
          null,
          fileMock,
        );
        expect(finalName).toEqual('orginal_name.test');
      });
    });

    describe("when the file does'nt have a originalName", () => {
      it('should to create a new fileName', () => {
        const squadDeliverableAgregate = new SquadDeliverablesAggregate(null);
        const finalName = squadDeliverableAgregate.getNameFromFile(null, {
          ...fileMock,
          originalname: null,
        });
        expect(finalName).toMatch(/deliverable.*/);
      });
    });
  });
});
