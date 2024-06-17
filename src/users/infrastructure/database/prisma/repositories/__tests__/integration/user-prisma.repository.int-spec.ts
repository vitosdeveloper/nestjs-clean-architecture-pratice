import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user-prisma-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'child_process';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    execSync('npm run migration:test');
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTesting(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('should throw a entity not found error', async () => {
    await expect(() => sut.findById('invalid-id')).rejects.toThrow(
      new NotFoundError(`User of id invalid-id not found.`),
    );
  });

  it('should find a ', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    const output = await sut.findById(entity._id);
    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });
});
