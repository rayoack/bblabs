import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ContactHubspot,
  ContactHubspotEvent,
} from 'src/integrations/dtos/contact-hubspot.dto';
import { BossaboxApiService } from '../../../integrations/bossabox-api.service';

@Injectable()
export class UpdateContactListener {
  constructor(private readonly bossaboxApiService: BossaboxApiService) {}

  @OnEvent('contact.update')
  async handleOrderCreatedEvent(event: ContactHubspotEvent) {
    const contact: ContactHubspot = {
      challengeName: event.challengeName,
      squadName: event.squadName,
      professionalType: event.professionalType,
      isCreator: event.isCreator,
    };
    try {
      return await this.bossaboxApiService.updateUser(event.token, contact);
    } catch (error) {}
  }
}
