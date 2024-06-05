import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { ConflictError } from '@/shared/errors/conflict-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;
  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('should throw an not found error when trying to find a email that doesn"t exist', async () => {
    await expect(sut.findByEmail('asd@asd.com')).rejects.toThrow(
      new NotFoundError(`Entity using the email asd@asd.com not found`),
    );
  });

  it('should find a entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByEmail(entity.email);
    expect(result.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should check if a registered email already exists', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError(`This email address is already in use`),
    );
  });

  it('should check if a unregistered email already exists', async () => {
    expect.assertions(0);
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.emailExists(entity.email);
  });
});
