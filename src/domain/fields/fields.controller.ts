import { Controller, Get } from '@nestjs/common';
import { FieldsService } from './fields.service';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Get()
  async findAll() {
    return await this.fieldsService.findAll();
  }
}
