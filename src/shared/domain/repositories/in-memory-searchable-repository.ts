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
  async search(props: SearchParams): Promise<SearchResult<E>> {
    props;
    throw new Error('Method not implemented.');
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    filter: string | null,
    sortDir: string | null,
  ): Promise<E[]> {
    console.log(items, filter, sortDir);
    throw Error();
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    console.log(items, page, perPage);
    throw Error();
  }
}
