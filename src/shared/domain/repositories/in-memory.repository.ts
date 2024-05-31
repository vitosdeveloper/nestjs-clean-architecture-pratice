import { NotFoundError } from '@/shared/errors/not-found-error';
import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contracts';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<E> {
    return this._get(id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    const index = await this._getIndex(entity.id);
    this.items[index] = entity;
  }

  async delete(id: string): Promise<void> {
    const index = await this._getIndex(id);
    this.items.splice(index, 1);
  }

  protected async _get(id: string): Promise<E> {
    const entity = this.items.find((i) => i.id === id);
    if (!entity) throw new NotFoundError('Entity not found');
    return entity;
  }

  protected async _getIndex(id: string): Promise<number> {
    await this._get(id);
    const index = this.items.findIndex((i) => i.id === id);
    return index;
  }
}
