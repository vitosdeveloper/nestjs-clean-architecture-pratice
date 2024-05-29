import { FieldErrors } from '../domain/entities/validators/validator-fields.interface';

export class ValidationErrors extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: FieldErrors) {
    super('Entity Validation Error');
    this.name = 'EntityValidationError';
  }
}
