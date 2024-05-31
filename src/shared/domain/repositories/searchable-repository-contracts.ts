import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contracts';

export type SortDIrection = 'asc' | 'desc';
export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDIrection | null;
  filter?: Filter;
};

export class SearchParams {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDIrection | null;
  protected _filter: string | null;

  constructor(props: SearchProps) {
    this._page = props.page;
    this._perPage = props.perPage;
    this._sort = props.sort;
    this._sortDir = props.sortDir;
    this._filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;
    if (
      Number.isNaN(_page) ||
      _page <= 0 ||
      parseInt(String(_page)) !== _page
    ) {
      _page = 1;
    }
    this._page = _page;
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    let _perPage = +value;
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(String(_perPage)) !== _perPage
    ) {
      _perPage = this._perPage;
    }
    this._perPage = _perPage;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = value ? `${value}` : null;
  }

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: SortDIrection | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  get filter() {
    return this._filter;
  }

  private set filter(value: string | null) {
    this._filter = value ? `${value}` : null;
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInpuut,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchInpuut): Promise<SearchOutput>;
}
