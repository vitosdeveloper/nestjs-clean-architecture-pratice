import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { SignUpUseCase } from '../../signup.usecase';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/in-memory/user-in-memory.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('singup usecase unit tests', () => {
  let sut: SignUpUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignUpUseCase.UseCase(repository, hashProvider);
  });

  it('should create a user', async () => {
    const spy = jest.spyOn(repository, 'insert');
    const props = UserDataBuilder({});
    const result = await sut.execute(props);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should fail creating a user with a email that is already in use', async () => {
    const props = UserDataBuilder({ email: 'asd@asd.com' });
    await sut.execute(props);
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('should thrown a error when the any field isnt passed', async () => {
    ['name', 'email', 'password'].forEach(async (field) => {
      const props = UserDataBuilder({ [field]: '' });
      await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
        BadRequestError,
      );
    });
  });
});
