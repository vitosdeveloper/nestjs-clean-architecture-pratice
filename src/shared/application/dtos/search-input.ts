import { SortDIrection } from '@/shared/domain/repositories/searchable-repository-contracts';

export type SearchInput<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDIrection | null;
  filter?: Filter;
};
