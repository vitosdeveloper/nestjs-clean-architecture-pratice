import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { SignUpUseCase } from '@/users/application/usecases/signup.usecase';
import { SignUpDto } from '../../dtos/sign-up.dto';
import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase';
import { SignInDto } from '../../dtos/sign-in.dto';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';

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
    expect(result).toMatchObject(output);
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should authenticate a user', async () => {
    const output: SignInUseCase.Output = props;
    const mockSignInUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signInUseCase'] = mockSignInUseCase as any;
    const input: SignInDto = {
      email: props.email,
      password: props.password,
    };
    const result = await sut.login(input);
    expect(result).toMatchObject(output);
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
    expect(result).toMatchObject(output);
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
    expect(result).toMatchObject(output);
    expect(UpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });
});
