import { ValidationError } from 'express-validator';
import { CustomError, CommonErrorStructure } from './custom.error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');
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
