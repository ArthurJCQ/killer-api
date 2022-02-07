import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: new RegExp(process.env.WEBSITE_DOMAIN),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Killer API')
    .setDescription('The Killer API description')
    .setVersion('0.5')
    .addTag('killer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
