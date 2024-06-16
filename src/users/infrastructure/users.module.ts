import { InjectionToken, Module, Provider } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { GetUserUseCase } from '../application/usecases/get-user.usecase';
import { ListUsersUseCase } from '../application/usecases/list-users.usecase';
import { SignInUseCase } from '../application/usecases/sign-in.usecase';
import { SignUpUseCase } from '../application/usecases/signup.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma-repository';

class NestProvider {
  static create(provide: InjectionToken, hash: boolean = false): Provider {
    const useFactory = (
      userRepository: UserRepository.Repository,
      hashProvider: HashProvider,
    ): any => {
      if (!hash) return new (provide as any)(userRepository);
      return new (provide as any)(userRepository, hashProvider);
    };
    return {
      provide,
      useFactory,
      inject: ['UserRepository', 'HashProvider'],
    };
  }
}

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    NestProvider.create(DeleteUserUseCase.UseCase),
    NestProvider.create(GetUserUseCase.UseCase),
    NestProvider.create(ListUsersUseCase.UseCase),
    NestProvider.create(UpdateUserUseCase.UseCase),
    NestProvider.create(SignInUseCase.UseCase, true),
    NestProvider.create(SignUpUseCase.UseCase, true),
    NestProvider.create(UpdatePasswordUseCase.UseCase, true),
    // {
    //   provide: DeleteUserUseCase.UseCase,
    //   useFactory: (userRepository: UserRepository.Repository) => {
    //     return new DeleteUserUseCase.UseCase(userRepository);
    //   },
    //   inject: ['UserRepository', 'HashProvider'],
    // },
    // {
    //   provide: GetUserUseCase.UseCase,
    //   useFactory: (userRepository: UserRepository.Repository) => {
    //     return new GetUserUseCase.UseCase(userRepository);
    //   },
    //   inject: ['UserRepository', 'HashProvider'],
    // },
    // {
    //   provide: ListUsersUseCase.UseCase,
    //   useFactory: (userRepository: UserRepository.Repository) => {
    //     return new ListUsersUseCase.UseCase(userRepository);
    //   },
    //   inject: ['UserRepository', 'HashProvider'],
    // },
    // {
    //   provide: SignInUseCase.UseCase,
    //   useFactory: (
    //     userRepository: UserRepository.Repository,
    //     hashProvider: HashProvider,
    //   ) => {
    //     return new SignInUseCase.UseCase(userRepository, hashProvider);
    //   },
    //   inject: ['UserRepository', 'HashProvider'],
    // },
    // {
    //   provide: SignUpUseCase.UseCase,
    //   useFactory: (
    //     userRepository: UserRepository.Repository,
    //     hashProvider: HashProvider,
    //   ) => {
    //     return new SignUpUseCase.UseCase(userRepository, hashProvider);
    //   },
    //   inject: ['UserRepository', 'HashProvider'],
    // },
    // {
    //   provide: UpdatePasswordUseCase.UseCase,
    //   useFactory: (
    //     userRepository: UserRepository.Repository,
    //     hashProvider: HashProvider,
    //   ) => {
    //     return new UpdatePasswordUseCase.UseCase(userRepository, hashProvider);
    //   },
    //   inject: ['UserRepository', 'HashProvider'],
    // },
    // {
    //   provide: UpdateUserUseCase.UseCase,
    //   useFactory: (userRepository: UserRepository.Repository) => {
    //     return new UpdateUserUseCase.UseCase(userRepository);
    //   },
    //   inject: ['UserRepository', 'HashProvider'],
    // },
  ],
})
export class UsersModule {}
