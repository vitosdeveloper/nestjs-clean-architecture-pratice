import { EntityValidationError } from '@/shared/errors/validation-error';
import { UserEntity, UserProps } from '../../user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity integration tests', () => {
  const verifyInvalidFields = (field: keyof UserProps) => {
    let props: UserProps = { ...UserDataBuilder({}), name: null };
    expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    props = { ...props, [field]: '' };
    expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    props = { ...props, [field]: 1 as any };
    expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    props = { ...props, [field]: 'a'.repeat(256) };
    expect(() => new UserEntity(props)).toThrow(EntityValidationError);
  };

  describe('constructor method', () => {
    it('should throw an error when creating a user with a invalid name', () => {
      verifyInvalidFields('name');
    });

    it('should throw an error when creating a user with a invalid email', () => {
      verifyInvalidFields('email');
    });

    it('should throw an error when creating a user with a invalid password', () => {
      verifyInvalidFields('password');
    });

    it('should throw an error when creating a user with a invalid createdAt', () => {
      verifyInvalidFields('createdAt');
    });

    it('should be a valid user', () => {
      expect.assertions(0);
      const props = UserDataBuilder({});
      new UserEntity(props);
    });
  });

  describe('update method', () => {
    const verifyInvalidUpdateValues = (
      field: 'updateName' | 'updatePassword',
    ) => {
      const entity = new UserEntity(UserDataBuilder({}));
      expect(() => entity[field](null)).toThrow(EntityValidationError);
      expect(() => entity[field]('')).toThrow(EntityValidationError);
      expect(() => entity[field](1 as any)).toThrow(EntityValidationError);
      expect(() => entity[field]('a'.repeat(256))).toThrow(
        EntityValidationError,
      );
    };

    it('should throw an error when updating a user with a invalid name', () => {
      verifyInvalidUpdateValues('updateName');
    });

    it('should be a valid name update', () => {
      expect.assertions(0);
      const entity = new UserEntity(UserDataBuilder({}));
      entity.updateName('Vitor');
    });

    it('should throw an error when updating a user with a invalid password', () => {
      verifyInvalidUpdateValues('updatePassword');
    });

    it('should be a valid password update', () => {
      expect.assertions(0);
      const entity = new UserEntity(UserDataBuilder({}));
      entity.updatePassword('banana&bacon');
    });
  });
});
