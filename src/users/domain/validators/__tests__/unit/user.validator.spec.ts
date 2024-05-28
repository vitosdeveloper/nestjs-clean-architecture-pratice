import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserRules, UserValidatorFactory } from '../../user.validator';

describe('UserValidator unit tests', () => {
  let sut;
  let props;
  beforeEach(() => {
    props = UserDataBuilder({});
    sut = UserValidatorFactory.create();
  });

  test('successful validations', () => {
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new UserRules(props));
  });

  describe('Name field', () => {
    test('failed validations', () => {
      let isValid = sut.validate(null as any);
      expect(isValid).toBeFalsy();
      expect(sut.errors.name).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), name: '' as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors.name).toStrictEqual(['name should not be empty']);

      isValid = sut.validate({ ...UserDataBuilder({}), name: 1 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors.name).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        name: 'a'.repeat(256) as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors.name).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('Email field', () => {
    test('failed validations', () => {
      let isValid = sut.validate(null as any);
      expect(isValid).toBeFalsy();
      expect(sut.errors.email).toStrictEqual([
        'email should not be empty',
        'email must be a string',
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), email: '' as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors.email).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), email: 1 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors.email).toStrictEqual([
        'email must be a string',
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        email: 'a'.repeat(256) as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors.email).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('Password field', () => {
    test('failed validations', () => {
      let isValid = sut.validate(null as any);
      expect(isValid).toBeFalsy();
      expect(sut.errors.password).toStrictEqual([
        'password should not be empty',
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), password: '' as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors.password).toStrictEqual([
        'password should not be empty',
      ]);

      isValid = sut.validate({ ...UserDataBuilder({}), password: 33 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors.password).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(256) as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors.password).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ]);
    });
  });

  describe('createdAt field', () => {
    test('failed validations', () => {
      let isValid = sut.validate({ ...props, createdAt: 1 });
      expect(isValid).toBeFalsy();
      expect(sut.errors.createdAt).toStrictEqual([
        'createdAt must be a Date instance',
      ]);

      isValid = sut.validate({ ...props, createdAt: '9' });
      expect(isValid).toBeFalsy();
      expect(sut.errors.createdAt).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});
