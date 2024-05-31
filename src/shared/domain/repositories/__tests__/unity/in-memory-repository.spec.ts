import { Entity } from '@/shared/domain/entities/entity';
import { InMemoryRepository } from '../../in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'Vitor', price: 33 });
    await sut.insert(entity);
    expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });
});
