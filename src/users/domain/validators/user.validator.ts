import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { UserProps } from '../entities/user.entity';
import { ClassFieldValidators } from '@/shared/domain/entities/validators/class-field-validator';

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;
  @MaxLength(255)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ name, email, password, createdAt }: UserProps) {
    Object.assign(this, { name, email, password, createdAt });
  }
}

export class UserValidator extends ClassFieldValidators<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)));
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
