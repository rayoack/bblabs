import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  EntityNotFoundError,
  NoConnectionForRepositoryError,
  NoConnectionOptionError,
  PersistedEntityNotFoundError,
  QueryFailedError,
} from 'typeorm';

@Catch(
  NoConnectionForRepositoryError,
  PersistedEntityNotFoundError,
  NoConnectionOptionError,
  QueryFailedError,
  EntityNotFoundError,
)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | EntityNotFoundError
      | QueryFailedError
      | NoConnectionForRepositoryError
      | PersistedEntityNotFoundError
      | NoConnectionOptionError,
    host: ArgumentsHost,
  ) {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(status).json({
      statusCode: status,
      path: request.url,
      stack: {
        slug: exception.name,
        message: exception.message,
        error: exception.stack,
      },
    });
  }
}
