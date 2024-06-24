import { UserRepository } from '@/users/domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { IUseCase } from '@/shared/application/usecases/use-case';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignInUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.email?.trim() || !input.password?.trim()) {
        throw new BadRequestError('Input data not provided');
      }
      const entity = await this.userRepository.findByEmail(input.email);
      const validPassword = await this.hashProvider.compareHash(
        input.password,
        entity.password,
      );
      if (!validPassword)
        throw new InvalidCredentialsError('Invalid credentials');

      return UserOutputMapper.toOutput(entity);
    }
  }
}
