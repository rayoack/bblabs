import { Injectable } from '@nestjs/common';
import got from 'got';
import { logger } from '../logging/logger';
import { ContactHubspot } from './dtos/contact-hubspot.dto';
import { NotificationDto } from './dtos/notification.dto';

@Injectable()
export class BossaboxApiService {
  async updateUser(token: string, json: ContactHubspot): Promise<any> {
    try {
      const { body } = await got.patch(
        `${process.env.BOSSABOX_API_URL}v1/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json,
          responseType: 'json',
        },
      );
      return body;
    } catch (error) {
      logger.error('Error trying update the bossabox user', error);
      throw error;
    }
  }

  async joinToLabsCommunity(token: string) {
    try {
      const json = { labsParticipant: true };
      const { body } = await got.patch(
        `${process.env.BOSSABOX_API_URL}v1/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json,
          responseType: 'json',
        },
      );
      return body;
    } catch (error) {
      logger.error('Error trying update the bossabox user', error);
      throw error;
    }
  }

  async sendNotification(notification: NotificationDto, userIds: string[]) {
    if (!userIds) return;
    try {
      await got.post(
        `${process.env.BOSSABOX_API_URL}v1/notifications/create/multiple`,
        {
          json: { notification, userIds },
          headers: {
            'bb-integration-token': process.env.BB_INTEGRATION_TOKEN,
          },
        },
      );
    } catch (error) {
      logger.error('Error trying create a notification', error);
    }
  }
}
