import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { SignUpUseCase } from '@/users/application/usecases/signup.usecase';
import { SignUpDto } from '../../dtos/sign-up.dto';
import { SignInDto } from '../../dtos/sign-in.dto';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase';
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase';
import { ListUsersDto } from '../../dtos/list-users.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from '../../presenters/user.presenter';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = '988ee2cd-1c13-44f9-8773-c18ce87e4ab2';
    props = {
      id,
      name: 'Vitor',
      email: 'vitosdeveloper@gmail.com',
      password: '1234',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const output: SignUpUseCase.Output = props;
    const mockSignUpUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signUpUseCase'] = mockSignUpUseCase as any;
    const input: SignUpDto = {
      name: props.name,
      email: props.email,
      password: props.password,
    };
    const result = await sut.create(input);
    expect(result).toMatchObject(new UserPresenter(output));
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should authenticate a user', async () => {
    const output = 'fake_token';
    const execute = jest.fn().mockReturnValue(Promise.resolve(output));
    const mockSignInUseCase = { execute };
    const mockAuthService = { generateJwt: execute };
    sut['signInUseCase'] = mockSignInUseCase as any;
    sut['authService'] = mockAuthService as any;
    const input: SignInDto = {
      email: props.email,
      password: props.password,
    };
    const result = await sut.login(input);
    expect(result).toStrictEqual(output);
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update a user', async () => {
    const output: UpdateUserUseCase.Output = props;
    const updateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updateUserUseCase'] = updateUserUseCase as any;
    const input: UpdateUserDto = {
      name: 'vivitos',
    };
    const result = await sut.update(id, input);
    expect(result).toMatchObject(new UserPresenter(output));
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input });
  });

  it('should update a password', async () => {
    const output: UpdatePasswordUseCase.Output = props;
    const UpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updatePasswordUseCase'] = UpdatePasswordUseCase as any;
    const input: UpdatePasswordDto = {
      password: '4321',
      oldPassword: props.password,
    };
    const result = await sut.updatePassword(id, input);
    expect(result).toMatchObject(new UserPresenter(output));
    expect(UpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should delete a user', async () => {
    const DeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve()),
    };
    sut['deleteUserUseCase'] = DeleteUserUseCase as any;
    await sut.remove(id);
    expect(DeleteUserUseCase.execute).toHaveBeenCalledWith({
      id,
    });
  });

  it('should find one user', async () => {
    const output: GetUserUseCase.Output = props;
    const GetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['getUserUseCase'] = GetUserUseCase as any;
    const result = await sut.findOne(id);
    expect(result).toMatchObject(new UserPresenter(output));
    expect(GetUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should list users', async () => {
    const output: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };
    const ListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['listUsersUseCase'] = ListUsersUseCase as any;
    const input: ListUsersDto = {
      page: 1,
      perPage: 1,
    };
    const result = await sut.search(input);
    expect(result).toStrictEqual(new UserCollectionPresenter(output));
    expect(ListUsersUseCase.execute).toHaveBeenCalledWith(input);
  });
});
