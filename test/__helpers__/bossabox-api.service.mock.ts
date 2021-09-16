import { BossaboxApiService } from '../../src/integrations/bossabox-api.service';

export const bossaboxApi = (): BossaboxApiService => ({
  updateUser: jest.fn(),
  sendNotification: jest.fn(),
  joinToLabsCommunity: jest.fn(),
});
