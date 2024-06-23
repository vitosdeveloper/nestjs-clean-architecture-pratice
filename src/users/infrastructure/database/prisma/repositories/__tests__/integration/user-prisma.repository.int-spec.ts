import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user-prisma-repository';
import { Test } from '@nestjs/testing';
import { execSync } from 'child_process';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserRepository } from '@/users/domain/repositories/user.repository';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;

  beforeAll(async () => {
    execSync('npm run migration:test');
    await Test.createTestingModule({
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

  it('should find a user by his id', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    const output = await sut.findById(entity._id);
    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);

    const result = await prismaService.user.findUnique({
      where: { id: entity.id },
    });
    expect(result).toStrictEqual(entity.toJSON());
  });

  it('should find all entities', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });
    const result = await sut.findAll();
    expect(result).toStrictEqual([entity]);
  });

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(16).fill(UserDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(UserEntity);
      });
    });
  });
});
