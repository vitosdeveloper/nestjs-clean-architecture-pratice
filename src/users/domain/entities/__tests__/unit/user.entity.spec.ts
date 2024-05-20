import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
  let sut: UserEntity;
  let props: UserProps;

  beforeEach(() => {
    props = UserDataBuilder({});
    sut = new UserEntity(props);
  });

  test('Constructor method', () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  test('Getter of name field', () => {
    expect(sut.props.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  test('Getter of email field', () => {
    expect(sut.props.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toBe('string');
  });

  test('Getter of password field', () => {
    expect(sut.props.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toBe('string');
  });

  test('Getter of createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined();
    expect(sut.createdAt).toEqual(props.createdAt);
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  test('updateName method should change the name', () => {
    const prevName = sut.name;
    const newName = 'Vitor';
    sut.updateName(newName);
    expect(prevName).not.toBe(sut.name);
    expect(sut.name).toBe(newName);
  });

  test('updatePassword method should change the password', () => {
    const prevPassword = sut.password;
    const newPassword = 'fried-bacon';
    sut.updatePassword(newPassword);
    expect(prevPassword).not.toBe(sut.password);
    expect(sut.password).toBe(newPassword);
  });
});
