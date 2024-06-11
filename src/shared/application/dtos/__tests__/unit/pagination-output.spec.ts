import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';
import { PaginationOutputMapper } from '../../pagination-output';

describe('PaginationOutputMapper unit tests', () => {
  it('should convert a SearchResult into a output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      sortDir: '',
      filter: 'fake',
    });
    const sut = PaginationOutputMapper.toOutput(result.items, result);

    const { items, total, currentPage, lastPage, perPage } = result;
    expect(sut).toStrictEqual({ items, total, currentPage, lastPage, perPage });
  });
});
