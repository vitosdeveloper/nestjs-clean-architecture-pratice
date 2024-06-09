import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider';

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it('should return a encrypted password from the generateHash method', async () => {
    const password = 'test-password';
    const hash = await sut.generateHash(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it('should compareHash method should fail', async () => {
    const password = 'test-password';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash('wrong-password', hash);
    expect(result).toBeFalsy();
  });

  it('should compareHash method should return true', async () => {
    const password = 'test-password';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash(password, hash);
    expect(result).toBeTruthy();
  });
});
