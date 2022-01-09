import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: new RegExp(process.env.WEBSITE_DOMAIN),
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
