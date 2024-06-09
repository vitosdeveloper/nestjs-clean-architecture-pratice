import { UserRepository } from '@/users/domain/repositories/user.repository';
import { BadRequestError } from '../errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserOutput } from '../dtos/user-output';
import { IUseCase } from '@/shared/application/usecases/use-case';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignUpUseCase {
  export type Input = {
    name: string;
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
      const { name, email, password } = input;
      if (!name.trim() || !email.trim() || !password.trim()) {
        throw new BadRequestError('Input data not provided');
      }

      const hashPassword = await this.hashProvider.generateHash(password);
      await this.userRepository.emailExists(email);
      const entity = new UserEntity(
        Object.assign(input, { password: hashPassword }),
      );
      await this.userRepository.insert(entity);
      return entity.toJSON();
    }
  }
}
