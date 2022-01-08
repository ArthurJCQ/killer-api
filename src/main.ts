import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: process.env.WEBSITE_URL,
      credentials: true,
    });
  }

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
