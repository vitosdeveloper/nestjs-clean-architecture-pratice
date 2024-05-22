import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ClassFieldValidators } from '../../class-field-validator';

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class ClassFieldValidatorsStub extends ClassFieldValidators<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassFieldValidators integration tests', () => {
  let sut;

  beforeEach(() => {
    sut = new ClassFieldValidatorsStub();
  });

  it('should get errors on validating', () => {
    expect(sut.validate(null)).toBeFalsy();
    expect(sut.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('should validate without errors', () => {
    const data = { name: 'value', price: 9 };
    expect(sut.validate(data)).toBeTruthy();
    expect(sut.errors).toStrictEqual(null);
    expect(sut.validatedData).toStrictEqual(new StubRules(data));
  });
});
