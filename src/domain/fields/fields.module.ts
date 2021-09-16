import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fields } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Fields])],
  controllers: [FieldsController],
  providers: [FieldsService],
})
export class FieldsModule {}
