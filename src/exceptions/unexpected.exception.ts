import { HttpStatus } from '@nestjs/common';
import { HttpBaseException } from './http-base.exception';

export class UnexpectedException extends HttpBaseException {
  constructor(slug: string, operation: string, error: unknown) {
    super(
      slug,
      `Unexpected error in "${operation}", please try again later`,
      HttpStatus.SERVICE_UNAVAILABLE,
      error,
    );
  }
}
