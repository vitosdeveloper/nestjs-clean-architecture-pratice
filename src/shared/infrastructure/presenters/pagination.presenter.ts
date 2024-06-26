import { Transform } from 'class-transformer';

export type PaginationPresenterProps = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
};
export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  currentPage: number;
  @Transform(({ value }) => parseInt(value))
  perPage: number;
  @Transform(({ value }) => parseInt(value))
  lastPage: number;
  @Transform(({ value }) => parseInt(value))
  total: number;

  constructor(output: PaginationPresenterProps) {
    this.currentPage = output.currentPage;
    this.perPage = output.perPage;
    this.lastPage = output.lastPage;
    this.total = output.total;
  }
}
