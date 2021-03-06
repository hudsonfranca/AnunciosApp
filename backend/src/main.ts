import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express'
import * as path from "path"


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use('/uploads',express.static(path.resolve(__dirname,'..','uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
