import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataInterceptorWrapper } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';

export async function applyGlobalConfig(app: INestApplication) {
  app.useGlobalInterceptors(
    new DataInterceptorWrapper(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
