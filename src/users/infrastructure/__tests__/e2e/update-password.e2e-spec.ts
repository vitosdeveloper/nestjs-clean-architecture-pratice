import { UserRepository } from '@/users/domain/repositories/user.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UsersModule } from '../../users.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updatePasswordDto: UpdatePasswordDto;
  const prismaService = new PrismaClient();
  let hashProvider: HashProvider;
  let entity: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTesting(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository.Repository>('UserRepository');
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    updatePasswordDto = {
      password: 'new_password',
      oldPassword: 'old_password',
    };
    await prismaService.user.deleteMany();
    const hashPassword = await hashProvider.generateHash('old_password');
    entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    await repository.insert(entity);
  });

  describe('POST /users', () => {
    it('should update a password', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(200);
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const user = await repository.findById(res.body.data.id);
      const checkNewPassword = await hashProvider.compareHash(
        'new_password',
        user.password,
      );
      expect(checkNewPassword).toBeTruthy();
    });

    it('should throw 404 err with NotFoundError', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/fakeId')
        .send(updatePasswordDto)
        .expect(404);
      expect(res.body.error).toBe('Not Found');
      expect(res.body.message).toEqual('User of id fakeId not found.');
    });

    it('should throw 422 err when a wrong password is sent', async () => {
      delete updatePasswordDto.password;
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should throw 422 err when a wrong oldPassword is sent', async () => {
      delete updatePasswordDto.oldPassword;
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]);
    });

    it('should throw a 404 error', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/fakeId')
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]);
    });

    it('should throw a 422 err when password and oldPassword doesnt match', async () => {
      updatePasswordDto.oldPassword = 'fake';
      await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(422)
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'password and oldPassword doesnt match',
        });
    });
  });
});