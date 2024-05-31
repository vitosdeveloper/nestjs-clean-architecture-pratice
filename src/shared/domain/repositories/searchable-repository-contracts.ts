import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contracts';

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInpuut,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchInpuut): Promise<SearchOutput>;
}
