import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

import { ExceptionResponse } from './types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const exceptionBody = exception.getResponse() as ExceptionResponse;

    let responseBody = {
      statusCode,
      errorCode: '',
      message: exceptionBody.message,
    };

    if (exceptionBody.key) {
      responseBody = {
        ...responseBody,
        errorCode: exceptionBody.key.toUpperCase(),
        message: await this.i18n.translate(exceptionBody.key, {
          lang: ctx.getRequest().i18nLang,
          args: exceptionBody.args,
        }),
      };
    }

    response.status(statusCode).json(responseBody);
  }
}
