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

    response.status(statusCode).json({
      statusCode,
      errorCode: (exceptionBody.key || exceptionBody.message[0]).toUpperCase(),
      message: await this.i18n.translate(
        exceptionBody.key || exceptionBody.message[0],
        { lang: ctx.getRequest().i18nLang, args: exceptionBody.args },
      ),
    });
  }
}
