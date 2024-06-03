import { Entity } from '@/shared/domain/entities/entity';
import { InMemorySearchableRepository } from '../../in-memory-searchable-repository';
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sorteableFields = ['name'];
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) return items;
    return items.filter((i) =>
      i.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

describe('InMemoryRepository unit tests', () => {
  let items: StubEntity[];
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    items = [
      new StubEntity({ name: 'Vitor', price: 33 }),
      new StubEntity({ name: 'Leozin', price: 13 }),
      new StubEntity({ name: 'Kei', price: 3 }),
      new StubEntity({ name: 'Parklez', price: 17 }),
      new StubEntity({ name: 'Pelipz', price: 8 }),
    ];
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should return the items with no filter when a invalid filter is passed in', async () => {
      const spyOnApplyFilter = jest.spyOn(items, 'filter');
      const filteredItems = await sut['applyFilter'](items, '');
      expect(filteredItems).toStrictEqual(items);
      expect(spyOnApplyFilter).not.toHaveBeenCalled();
    });

    it('should filter correctly', async () => {
      const spyOnApplyFilter = jest.spyOn(items, 'filter');
      let filteredItems = await sut['applyFilter'](items, 'Vitor');
      expect(filteredItems).toStrictEqual([items[0]]);
      expect(spyOnApplyFilter).toHaveBeenCalledTimes(1);

      filteredItems = await sut['applyFilter'](items, 'i');
      expect(filteredItems).toStrictEqual([
        items[0],
        items[1],
        items[2],
        items[4],
      ]);
      expect(spyOnApplyFilter).toHaveBeenCalledTimes(2);

      filteredItems = await sut['applyFilter'](items, 'invalid-filter');
      expect(filteredItems).toStrictEqual([]);
      expect(spyOnApplyFilter).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('shouldn"t order passing invalid params', async () => {
      const itemsToCompare = Array.from(items);
      let sortedItems = await sut['applySort'](items, null, null);
      expect(sortedItems).toStrictEqual(itemsToCompare);

      sortedItems = await sut['applySort'](items, 'price', 'asc');
      expect(sortedItems).toStrictEqual(itemsToCompare);
    });

    it('should sort correctly', async () => {
      const itemsToCompare = Array.from(items);

      let sortedItems = await sut['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([
        itemsToCompare[2],
        itemsToCompare[1],
        itemsToCompare[3],
        itemsToCompare[4],
        itemsToCompare[0],
      ]);

      sortedItems = await sut['applySort'](items, 'name', 'desc');
      expect(sortedItems).toStrictEqual([
        itemsToCompare[0],
        itemsToCompare[4],
        itemsToCompare[3],
        itemsToCompare[1],
        itemsToCompare[2],
      ]);
    });
  });

  describe('applyPagination method', () => {
    it('should paginate the items', async () => {
      let paginatedItems = await sut['applyPagination'](items, 1, 2);
      expect(paginatedItems).toStrictEqual([items[0], items[1]]);

      paginatedItems = await sut['applyPagination'](items, 2, 2);
      expect(paginatedItems).toStrictEqual([items[2], items[3]]);

      paginatedItems = await sut['applyPagination'](items, 3, 2);
      expect(paginatedItems).toStrictEqual([items[4]]);

      paginatedItems = await sut['applyPagination'](items, 1, 3);
      expect(paginatedItems).toStrictEqual([items[0], items[1], items[2]]);

      paginatedItems = await sut['applyPagination'](items, 2, 3);
      expect(paginatedItems).toStrictEqual([items[3], items[4]]);
    });
  });

  describe('search method', () => {
    it('should apply pagination even when it contains null params', async () => {
      const entity = new StubEntity({ name: 'test', price: 50 });
      const items = Array(16).fill(entity);
      sut.items = items;

      const params = await sut.search(new SearchParams());
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      );
    });

    it('should apply pagination and filtering', async () => {
      const itemsToCompare = Array.from(items);
      sut.items = itemsToCompare;
      let params = await sut.search(
        new SearchParams({ filter: 'i', page: 1, perPage: 2 }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [itemsToCompare[0], itemsToCompare[1]],
          total: 4,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'i',
        }),
      );

      params = await sut.search(
        new SearchParams({ filter: 'i', page: 2, perPage: 2 }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [itemsToCompare[2], itemsToCompare[4]],
          total: 4,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'i',
        }),
      );
    });
  });
});
