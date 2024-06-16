import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../in-memory/user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;
  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('should throw an not found error when trying to find a email that doesn"t exist', async () => {
    await expect(sut.findByEmail('asd@asd.com')).rejects.toThrow(
      new NotFoundError(`Entity using the email asd@asd.com not found`),
    );
  });

  it('should find a entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByEmail(entity.email);
    expect(result.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should check if a registered email already exists', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError(`This email address is already in use`),
    );
  });

  it('should check if a unregistered email already exists', async () => {
    expect.assertions(0);
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.emailExists(entity.email);
  });

  it('shouldn"t filter items when the filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findAll();
    const spyFilter = jest.spyOn(result, 'filter');
    const filteredItems = await sut['applyFilter'](result, null);
    expect(spyFilter).not.toHaveBeenCalled();
    expect(filteredItems).toStrictEqual(result);
  });

  it('should filter the name field using a filter param', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
    ];

    const spyFilter = jest.spyOn(items, 'filter');
    const filteredItems = await sut['applyFilter'](items, 'TEST');
    expect(spyFilter).toHaveBeenCalled();
    expect(filteredItems).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by createdAt using a null sort param', async () => {
    const createdAt = new Date();
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test', createdAt })),
      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ];

    const sortedItems = await sut['applySort'](items, null, null);
    expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('Should sort by the name field', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'c' })),
      new UserEntity(
        UserDataBuilder({
          name: 'd',
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'a',
        }),
      ),
    ];
    let itemsSorted = await sut['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

    itemsSorted = await sut['applySort'](items, 'name', null);
    expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
  });
});
