import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { IUseCase } from '@/shared/application/usecases/use-case';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string;
    password: string;
    oldPassword: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);
      if (!input.password || !input.oldPassword)
        throw new InvalidPasswordError(
          'password and oldPassword fields are required',
        );
      const passwordCheck = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      );
      if (!passwordCheck)
        throw new InvalidPasswordError('password and oldPassword doesnt match');
      const hashPassword = await this.hashProvider.generateHash(input.password);
      entity.updatePassword(hashPassword);
      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
