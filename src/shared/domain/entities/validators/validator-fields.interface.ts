export type FieldErrors = {
  [field: string]: string[];
};

export interface IFieldsValidator<ValidatedProps> {
  errors: FieldErrors;
  validatedData: ValidatedProps;
  validate(data: unknown): boolean;
}
