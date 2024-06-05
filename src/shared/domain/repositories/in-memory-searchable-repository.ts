import { Entity } from '../entities/entity';
import {
  SearchParams,
  SearchResult,
  SearchableRepositoryInterface,
} from './searchable-repository-contracts';
import { InMemoryRepository } from './in-memory-repository';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  sorteableFields: string[] = [];
  async search(props: SearchParams): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);
    const sortedItems = await this.applySort(
      filteredItems,
      props.sort,
      props.sortDir,
    );

    const paginatedItems = await this.applyPagination(
      sortedItems,
      props.page,
      props.perPage,
    );

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]> {
    if (!sort || !this.sorteableFields.includes(sort)) return items;
    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sortDir === 'asc' ? -1 : 1;
      }
      if (a.props[sort] > b.props[sort]) {
        return sortDir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage;
    const limit = start + perPage;
    return items.slice(start, limit);
  }
}
