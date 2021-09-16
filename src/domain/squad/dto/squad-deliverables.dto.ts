export class SquadDeliverablesDto {
  stageId: number;
  attachments: SquadDeliverablesAttachmentDto[] = [];
}

export class SquadDeliverablesAttachmentDto {
  type: string;
  name: string;
  url: string;
}
