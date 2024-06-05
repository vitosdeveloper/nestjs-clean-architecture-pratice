import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable-repository';
import { SortDIrection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ConflictError } from '@/shared/errors/conflict-error';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sorteableFields: string[] = ['name', 'createdAt'];
  protected async applyFilter(
    items: UserEntity[],
    filter: UserRepository.Filter,
  ): Promise<UserEntity[]> {
    if (!filter) return items;
    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDIrection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find((i) => i.email === email);
    if (!entity)
      throw new NotFoundError(`Entity using the email ${email} not found`);
    return entity;
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.items.find((i) => i.email === email);
    if (!entity) return;
    throw new ConflictError(`This email address is already in use`);
  }
}
