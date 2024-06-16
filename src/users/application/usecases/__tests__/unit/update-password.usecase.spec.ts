import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/in-memory/user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UpdatePasswordUseCase } from '../../update-password.usecase';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUseCase usecase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
  });

  it('should throw a error when it can"t find a entity', async () => {
    await expect(() =>
      sut.execute({
        id: 'fake-id',
        password: 'test-password',
        oldPassword: 'old-password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('should throw a error when a password or oldPassword arent provided', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    repository.items = [entity];

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: '',
        password: '1234',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('password and oldPassword fields are required'),
    );

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: '1234',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('password and oldPassword fields are required'),
    );
  });

  it('should throw a error when password doesnt match the right password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    repository.items = [entity];

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'wrong-pass',
        password: 'wrong-pass',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('password and oldPassword doesnt match'),
    );
  });

  it('should update the password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const updateSpy = jest.spyOn(repository, 'update');
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    repository.items = [entity];

    const result = await sut.execute({
      id: entity.id,
      oldPassword: '1234',
      password: 'new-password',
    });

    const checkNewPassword = await hashProvider.compareHash(
      'new-password',
      result.password,
    );

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy();
  });
});
