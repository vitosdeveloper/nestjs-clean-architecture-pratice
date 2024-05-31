import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable-repository';
import { ConflictError } from '@/shared/errors/conflict-error';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
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
