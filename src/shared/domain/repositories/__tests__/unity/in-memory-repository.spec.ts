import { Entity } from '@/shared/domain/entities/entity';
import { InMemoryRepository } from '../../in-memory.repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let entity: StubEntity;
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    entity = new StubEntity({ name: 'Vitor', price: 33 });
    sut = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    await sut.insert(entity);
    expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should fail on finding entity', async () => {
    await expect(sut.findById('0')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should find a entity by id', async () => {
    await sut.insert(entity);
    const result = await sut.findById(entity.id);
    expect(result).toStrictEqual(entity);
  });
});
