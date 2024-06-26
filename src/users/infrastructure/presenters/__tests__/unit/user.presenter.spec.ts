import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from '../../user.presenter';

describe('UserPresenter unit tests', () => {
  let sut: UserPresenter;
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    email: 'a@a.com',
    password: 'fake',
    createdAt: new Date(),
  };

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });

  it('should present data correctly', () => {
    const output = instanceToPlain(sut);
    expect(output).toStrictEqual({
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      name: 'test name',
      email: 'a@a.com',
      createdAt: props.createdAt.toISOString(),
    });
  });
});
