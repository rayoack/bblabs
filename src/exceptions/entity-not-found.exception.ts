import { HttpStatus } from '@nestjs/common';
import { HttpBaseException } from './http-base.exception';

export class EntityNotFoundException extends HttpBaseException {
  constructor(slug: string, entityName: string, id: number | string) {
    super(slug, `${entityName} not found (id=${id})`, HttpStatus.NOT_FOUND);
  }
}
