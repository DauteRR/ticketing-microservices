import { CustomError, CommonErrorStructure } from './custom.error';

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Unauthorized');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeError(): CommonErrorStructure {
    return {
      errors: [{ message: 'Unauthorized' }]
    };
  }
}
