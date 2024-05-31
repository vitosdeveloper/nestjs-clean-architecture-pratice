import { EntityValidationError } from '@/shared/errors/validation-error';
import { UserEntity, UserProps } from '../../user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

const verifyField = (field: keyof UserProps) => {
  let props: UserProps = { ...UserDataBuilder({}), name: null };
  expect(() => new UserEntity(props)).toThrow(EntityValidationError);
  props = { ...props, [field]: '' };
  expect(() => new UserEntity(props)).toThrow(EntityValidationError);
  props = { ...props, [field]: 1 as any };
  expect(() => new UserEntity(props)).toThrow(EntityValidationError);
  props = { ...props, [field]: 'a'.repeat(256) };
  expect(() => new UserEntity(props)).toThrow(EntityValidationError);
};

describe('UserEntity integration tests', () => {
  describe('constructor method', () => {
    it('should throw an error when creating a user with a invalid name', () => {
      verifyField('name');
    });

    it('should throw an error when creating a user with a invalid email', () => {
      verifyField('email');
    });

    it('should throw an error when creating a user with a invalid password', () => {
      verifyField('password');
    });

    it('should throw an error when creating a user with a invalid createdAt', () => {
      verifyField('createdAt');
    });
  });
});
