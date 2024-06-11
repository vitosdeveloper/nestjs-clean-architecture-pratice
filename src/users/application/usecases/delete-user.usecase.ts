import { UserRepository } from '@/users/domain/repositories/user.repository';
import { IUseCase } from '@/shared/application/usecases/use-case';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DeleteUserUseCase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<void> {
      await this.userRepository.delete(input.id);
    }
  }
}
