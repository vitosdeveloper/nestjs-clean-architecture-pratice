import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { SignUpUseCase } from '@/users/application/usecases/signup.usecase';
import { SignUpDto } from '../../dtos/sign-up.dto';

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
    expect(output).toMatchObject(result);
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input);
  });
});
