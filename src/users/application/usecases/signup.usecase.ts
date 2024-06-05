import { UserRepository } from '@/users/domain/repositories/user.repository';
import { BadRequestError } from '../errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignUpCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  };

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      console.log(input);
      const { name, email, password } = input;
      if (!name.trim() || !email.trim() || !password.trim()) {
        throw new BadRequestError('Input data not provided');
      }

      await this.userRepository.emailExists(email);
      const entity = new UserEntity(input);
      await this.userRepository.insert(entity);
      return entity.toJSON();
    }
  }
}
