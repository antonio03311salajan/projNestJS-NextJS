import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import { IConfig } from './public/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 600,
    }
  });
  app.use(helmet());
  app.use(json({ limit: "30mb" }))
  app.use(urlencoded({ extended: true, limit: "30mb" }))

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const configService: ConfigService<IConfig> = app.get(ConfigService);
  const port = configService.get("PORT");
  await app.listen(port);
}
bootstrap();
