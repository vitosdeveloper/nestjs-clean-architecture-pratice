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
import { AuthModule } from '@/auth/infrastructure/auth.module';

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
  imports: [AuthModule],
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
  ],
})
export class UsersModule {}
