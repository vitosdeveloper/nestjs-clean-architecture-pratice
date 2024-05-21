import * as classValidatorLib from 'class-validator';
import { ClassFieldValidators } from '../../class-field-validator';

class ClassFieldValidatorsStub extends ClassFieldValidators<{
  field: string;
}> {}

describe('ClassFieldValidators unit tests', () => {
  let sut;

  beforeEach(() => {
    sut = new ClassFieldValidatorsStub();
  });

  it('should initialize errors and validatedData props with null', () => {
    expect(sut.errors).toBeNull();
    expect(sut.validatedData).toBeNull();
  });

  it('should get errors after validating', () => {
    const validateSyncSpy = jest.spyOn(classValidatorLib, 'validateSync');
    const constraints = { isRequired: 'test-error' };
    const field = [constraints.isRequired];
    validateSyncSpy.mockReturnValue([{ property: 'field', constraints }]);

    expect(sut.validate(null)).toBeFalsy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(sut.validatedData).toBeNull();
    expect(sut.errors).toStrictEqual({ field });
  });

  it('should not get errors after validating', () => {
    const validateSyncSpy = jest.spyOn(classValidatorLib, 'validateSync');
    const field = 'value';
    validateSyncSpy.mockReturnValue([]);

    expect(sut.validate({ field })).toBeTruthy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(sut.validatedData).toStrictEqual({ field });
    expect(sut.errors).toBeNull();
  });
});
