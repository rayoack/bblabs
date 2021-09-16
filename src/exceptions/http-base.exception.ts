import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from '../logging/logger';

export abstract class HttpBaseException extends HttpException {
  constructor(
    slug: string,
    message: string,
    status: HttpStatus,
    error?: unknown,
  ) {
    super({ slug, message, error }, status);
    logger.error(slug, message, error);
  }
}
