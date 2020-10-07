import { ValidationError } from 'express-validator';
import { BaseError, CommonErrorStructure } from './base-error';

export class RequestValidationError extends BaseError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super();
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): CommonErrorStructure {
    return {
      errors: this.errors.map(error => ({
        message: error.msg,
        field: error.param
      }))
    };
  }
}
