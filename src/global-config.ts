import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataInterceptorWrapper } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';

export async function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new DataInterceptorWrapper(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
