import { EntityValidationError } from '@/shared/errors/validation-error';
import { UserEntity, UserProps } from '../../user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity integration tests', () => {
  describe('constructor method', () => {
    it('should throw an error when creating a user with a invalid name', () => {
      let props: UserProps = { ...UserDataBuilder({}), name: null };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...props, name: '' };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...props, name: 1 as any };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...props, name: 'a'.repeat(256) };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });
  });
});
