import { validateSync } from 'class-validator';
import { FieldErrors, IFieldsValidator } from './validator-fields.interface';

export abstract class ClassFieldValidators<ValidatedProps>
  implements IFieldsValidator<ValidatedProps>
{
  errors: FieldErrors = null;
  validatedData: ValidatedProps = null;

  validate(data: any) {
    const errors = validateSync(data);
    if (!errors.length) {
      this.validate = data;
      return true;
    }

    this.errors = {};
    for (const error of errors) {
      const field = error.property;
      this.errors[field] = Object.values(error.constraints);
    }
    return false;
  }
}
