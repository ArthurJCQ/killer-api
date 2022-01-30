import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const exceptionBody = exception.getResponse() as {
      statusCode?: number;
      message?: string;
      key?: string;
      args?: Record<string, never>;
    };

    const responseBody = {
      statusCode: statusCode,
      errorCode: '',
      message: exceptionBody.message,
    };

    if (exceptionBody.key) {
      responseBody.errorCode = exceptionBody.key;
      responseBody.message = await this.i18n.translate(exceptionBody.key, {
        lang: ctx.getRequest().i18nLang,
        args: exceptionBody.args,
      });
    }

    response.status(statusCode).json(responseBody);
  }
}
