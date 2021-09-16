import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnexpectedException } from '../../exceptions/unexpected.exception';
import { Fields } from '../entities';
import { FieldsRepository } from './fields.repository';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Fields)
    private fieldsRepository: FieldsRepository,
  ) {}

  async findAll(): Promise<Fields[]> {
    try {
      return await this.fieldsRepository.find();
    } catch (err) {
      throw new UnexpectedException(
        'unexpeced-error-find-all-fields',
        'fields.service.findAll',
        err,
      );
    }
  }
}
