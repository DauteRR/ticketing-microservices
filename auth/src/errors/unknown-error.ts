import { BaseError, CommonErrorStructure } from './base-error';

export class UnknownError extends BaseError {
  statusCode = 500;

  constructor() {
    super();
    Object.setPrototypeOf(this, UnknownError.prototype);
  }

  serializeError(): CommonErrorStructure {
    return {
      errors: [{ message: 'Unknown error' }]
    };
  }
}
