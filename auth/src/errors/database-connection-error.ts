import { CustomError, CommonErrorStructure } from './custom-error';

export class DatabaseConnectionError extends CustomError {
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
