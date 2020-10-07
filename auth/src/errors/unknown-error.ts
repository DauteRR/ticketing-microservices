import { CustomError, CommonErrorStructure } from './custom-error';

export class UnknownError extends CustomError {
  statusCode = 500;

  constructor() {
    super('Unknown error');
    Object.setPrototypeOf(this, UnknownError.prototype);
  }

  serializeError(): CommonErrorStructure {
    return {
      errors: [{ message: 'Unknown error' }]
    };
  }
}
