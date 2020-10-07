import { BaseError, CommonErrorStructure } from './base-error';

export class DatabaseConnectionError extends BaseError {
  statusCode = 500;

  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError(): CommonErrorStructure {
    return {
      errors: [{ message: 'Error connecting to database' }]
    };
  }
}
