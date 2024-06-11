import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UpdateUserUseCase } from '../../update-user.usecase';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('updateuser usecase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase.UseCase(repository);
  });

  it('shouldnt find a entity', async () => {
    await expect(() =>
      sut.execute({ id: 'fake-id', name: 'test-name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('should throw a error when name isnt provided', async () => {
    await expect(() =>
      sut.execute({ id: 'fake-id', name: '' }),
    ).rejects.toThrow(new BadRequestError('Name not provided'));
  });

  it('should update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;
    const result = await sut.execute({ id: items[0].id, name: 'updated-name' });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(items[0].toJSON());
  });
});
