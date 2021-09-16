import { Module } from '@nestjs/common';
import { BossaboxApiService } from './bossabox-api.service';

@Module({
  providers: [BossaboxApiService],
  exports: [BossaboxApiService],
})
export class IntegrationModule {}
