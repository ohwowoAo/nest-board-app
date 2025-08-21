import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import type { CookieParseOptions } from 'cookie-parser';
import type { RequestHandler } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cookieParserFn: (
    secret?: string | string[],
    options?: CookieParseOptions
  ) => RequestHandler = cookieParser;
  app.use(cookieParserFn());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: true, credentials: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') ?? 4000;
  await app.listen(port);
  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}
void bootstrap();
