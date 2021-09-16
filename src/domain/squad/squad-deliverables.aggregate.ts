import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, QueryRunner } from 'typeorm';
import { UnexpectedException } from '../../exceptions/unexpected.exception';
import { AwsStorageService } from '../../integrations/aws-storage.service';
import { ContestChallenges, Squad, Users } from '../entities';
import { DeliverablesStages } from '../entities/deliverables-stages.entity';
import { SquadDeliverablesAttachments } from '../entities/squad-deliverables-attachments.entity';
import { SquadDeliverables } from '../entities/squad-deliverables.entity';
import {
  SquadDeliverablesAttachmentDto,
  SquadDeliverablesDto,
} from './dto/squad-deliverables.dto';

@Injectable()
export class SquadDeliverablesAggregate {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    title: string,
    path: string,
  ): Promise<SquadDeliverablesAttachmentDto> {
    try {
      const s3Client = new AwsStorageService();
      const fileName = this.getNameFromFile(title, file);
      const url = await s3Client.uploadFile({
        Body: file.buffer,
        Key: `${path}/${fileName}`,
        ContentType: `${file.mimetype}`,
      });
      const attch = new SquadDeliverablesAttachmentDto();
      attch.name = fileName;
      attch.url = url;
      return attch;
    } catch (error) {
      throw new UnexpectedException(
        'send-squad-deliverables-attachments',
        'SquadDeliverablesAggregate.sendAttachments',
        error,
      );
    }
  }

  async removeDeliverables(
    squad: Squad,
    stage: DeliverablesStages,
    queryRunner: QueryRunner = this.connection.createQueryRunner(),
    removeFromS3 = true,
  ) {
    const s3Client = new AwsStorageService();

    const deliverables = await queryRunner.manager
      .getRepository(SquadDeliverables)
      .find({
        where: { squad, stage },
        relations: ['stage'],
      });

    for (let i = 0; i < deliverables.length; i++) {
      const deliverable = deliverables[i];
      await queryRunner.manager
        .getRepository(SquadDeliverablesAttachments)
        .delete({
          squadDeliverables: deliverable,
        });
      if (removeFromS3)
        await s3Client.removeFolder({
          Key: this.getBucketToAttachments(squad.id, deliverable.stage.name),
        });
      await queryRunner.manager
        .getRepository(SquadDeliverables)
        .delete(deliverable.id);
    }
  }

  async save(
    squad: Squad,
    creator: Users,
    squadDeliverableDto: SquadDeliverablesDto,
  ) {
    const { stageId, attachments } = squadDeliverableDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const selectedStage = await queryRunner.manager.findOne(
        DeliverablesStages,
        {
          where: { id: stageId },
        },
      );
      if (!selectedStage)
        throw new BadRequestException(
          'A etapa enviada não corresponde a nenhuma etapa válida.',
        );

      await this.removeDeliverables(squad, selectedStage, queryRunner, false);

      const squadDeliverable = new SquadDeliverables();
      squadDeliverable.squad = squad;
      squadDeliverable.stage = selectedStage;
      squadDeliverable.attachments = attachments.map(
        (a) =>
          new SquadDeliverablesAttachments(
            a.name,
            a.url,
            a.type,
            squadDeliverable,
            creator,
          ),
      );
      const squadDeliverableSaved = await queryRunner.manager.save(
        squadDeliverable,
      );
      const attachmentsSaved = await queryRunner.manager.save(
        squadDeliverable.attachments,
      );
      await queryRunner.commitTransaction();
      return {
        ...squadDeliverableSaved,
        stage: squadDeliverableSaved.stage.name,
        attachments: attachmentsSaved.map((a) => ({
          ...a,
          squadDeliverables: null,
        })),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getDeliverables(squadId: string, challengeId: number) {
    const squadDeliverableStages = await this.connection
      .getRepository(SquadDeliverables)
      .createQueryBuilder('squadDeliverable')
      .innerJoinAndSelect('squadDeliverable.attachments', 'attachment')
      .leftJoinAndSelect('squadDeliverable.stage', 'stage')
      .where('squadDeliverable.squad = :squadId', { squadId })
      .getMany();

    const challenge = await this.connection
      .getRepository(ContestChallenges)
      .createQueryBuilder('contestChallenge')
      .leftJoinAndSelect(
        'contestChallenge.deliverablesStages',
        'deliverablesStages',
      )
      .where('contestChallenge.id = :challengeId', { challengeId })
      .getOne();

    const deliverables = challenge.deliverablesStages.map(
      (deliverableStage) => {
        const squadDeliverableStage = squadDeliverableStages.filter(
          (squadDeliverable) =>
            squadDeliverable.stage.name === deliverableStage.name,
        );
        const squadDeliverableStageAttachments = [].concat(
          ...squadDeliverableStage.map((s) => s.attachments),
        );
        const attachmentFiles = squadDeliverableStageAttachments.filter(
          (a) => a.type === 'file',
        );
        const attachmentLinks = squadDeliverableStageAttachments.filter(
          (a) => a.type === 'link',
        );

        return {
          stage: deliverableStage,
          attachmentFiles,
          attachmentLinks,
        };
      },
    );

    return deliverables;
  }

  getBucketToAttachments = (squadId: string, stage: string) =>
    `squad-${squadId}/${stage}`;

  getNameFromFile(title: string, file: Express.Multer.File): string {
    let finalName: string;
    if (file.originalname) {
      const originalNameTokens = file.originalname.split('.');
      const extension = `.${originalNameTokens.pop()}`;
      if (title) {
        finalName = title.concat(extension);
      } else {
        finalName = originalNameTokens
          .map((token) => token.replace(/[^a-z0-9]/gi, '_').toLowerCase())
          .join('')
          .concat(extension);
      }
    } else {
      finalName = `deliverable-${new Date().toISOString()}.data`;
    }
    return finalName;
  }
}
