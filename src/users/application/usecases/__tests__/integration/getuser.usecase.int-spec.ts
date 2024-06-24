import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { GetUserUseCase } from '../../get-user.usecase';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma-repository';

describe('GetUserUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: GetUserUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTesting(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new GetUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throw a error when entity isnt found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('User of id fakeId not found.'),
    );
  });

  it('should returns a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({ id: entity._id });
    expect(output).toMatchObject(model);
  });
});
