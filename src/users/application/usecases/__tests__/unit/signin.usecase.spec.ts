import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/in-memory/user-in-memory.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { SignInUseCase } from '../../sign-in.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

describe('sing-in usecase unit tests', () => {
  let sut: SignInUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignInUseCase.UseCase(repository, hashProvider);
  });

  it('should throw BadRequestError', async () => {
    const { email, password } = {
      email: 'vitosdeveloper@gmail.com',
      password: 'bacon',
    };
    let entity = new UserEntity(
      UserDataBuilder({
        email,
        password: await hashProvider.generateHash(password),
      }),
    );
    repository.items = [entity];
    await expect(() =>
      sut.execute({
        email: '',
        password,
      }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));

    entity = new UserEntity(
      UserDataBuilder({
        email,
        password: await hashProvider.generateHash(password),
      }),
    );
    repository.items = [entity];
    await expect(() =>
      sut.execute({
        email,
        password: '',
      }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));
  });

  it('should fail signin', async () => {
    const { email, password } = {
      email: 'vitosdeveloper@gmail.com',
      password: 'bacon',
    };
    const entity = new UserEntity(
      UserDataBuilder({
        email,
        password: await hashProvider.generateHash(password),
      }),
    );
    repository.items = [entity];
    await expect(() =>
      sut.execute({ email, password: 'wrong-password' }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('shouldnt find the email', async () => {
    await expect(() =>
      sut.execute({
        email: 'vitosdeveloper@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(
      new NotFoundError(
        'Entity using the email vitosdeveloper@gmail.com not found',
      ),
    );
  });

  it('should successfully signin', async () => {
    const findByEmailSpy = jest.spyOn(repository, 'findByEmail');
    const { email, password } = {
      email: 'vitosdeveloper@gmail.com',
      password: 'bacon',
    };
    const entity = new UserEntity(
      UserDataBuilder({
        email,
        password: await hashProvider.generateHash(password),
      }),
    );
    repository.items = [entity];
    const result = await sut.execute({ email, password });
    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJSON());
  });
});
