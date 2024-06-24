import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UpdatePasswordUseCase } from '../../update-password.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma-repository';

describe('UpdatePasswordUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTesting(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throw a error when a entity isnt find by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'OldPassword',
        password: 'NewPassword',
      }),
    ).rejects.toThrow(new NotFoundError(`User of id ${entity.id} not found.`));
  });

  it('should throw a error when old password isnt provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: '',
        password: 'NewPassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('password and oldPassword fields are required'),
    );
  });

  it('should throw a error when the password isnt provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'OldPassword',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('password and oldPassword fields are required'),
    );
  });

  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({
      id: entity._id,
      oldPassword: '1234',
      password: 'NewPassword',
    });

    const result = await hashProvider.compareHash(
      'NewPassword',
      output.password,
    );

    expect(result).toBeTruthy();
  });
});
