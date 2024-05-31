import { SearchParams } from '../../searchable-repository-contracts';

describe('searchableRepositoryContracts unit tests', () => {
  describe('SearchParams tests', () => {
    test('page prop', () => {
      const params = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 'test', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ];

      params.forEach(({ page, expected }) => {
        const sut = new SearchParams({ page: page as any });
        expect(sut.page).toBe(expected);
      });
    });

    test('perPage prop', () => {
      const params = [
        { perPage: null, expected: 15 },
        { perPage: undefined, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 'test', expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 2, expected: 2 },
        { perPage: 25, expected: 25 },
      ];

      params.forEach(({ perPage, expected }) => {
        const sut = new SearchParams({ perPage: perPage as any });
        expect(sut.perPage).toBe(expected);
      });
    });

    test('sort prop', () => {
      const params = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 'test', expected: 'test' },
        { sort: 0, expected: null },
        { sort: -1, expected: '-1' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: null },
        { sort: {}, expected: '[object Object]' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
        { sort: 25, expected: '25' },
      ];

      params.forEach(({ sort, expected }) => {
        const sut = new SearchParams({ sort: sort as any });
        expect(sut.sort).toBe(expected);
      });
    });

    test('sortDir prop', () => {
      const params = [
        { sortDir: null, expected: 'desc' },
        { sortDir: undefined, expected: 'desc' },
        { sortDir: '', expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: -1, expected: 'desc' },
        { sortDir: 5.5, expected: 'desc' },
        { sortDir: true, expected: 'desc' },
        { sortDir: false, expected: 'desc' },
        { sortDir: {}, expected: 'desc' },
        { sortDir: 1, expected: 'desc' },
        { sortDir: 2, expected: 'desc' },
        { sortDir: 25, expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'DESC', expected: 'desc' },
      ];

      params.forEach(({ sortDir, expected }) => {
        const sut = new SearchParams({ sort: 'name', sortDir: sortDir as any });
        expect(sut.sortDir).toBe(expected);
      });
    });

    test('filter prop', () => {
      const params = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: '', expected: null },
        { filter: 'test', expected: 'test' },
        { filter: 0, expected: null },
        { filter: -1, expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: null },
        { filter: {}, expected: '[object Object]' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 25, expected: '25' },
      ];

      params.forEach(({ filter, expected }) => {
        const sut = new SearchParams({ sort: 'name', filter: filter as any });
        expect(sut.filter).toBe(expected);
      });
    });
  });
});
