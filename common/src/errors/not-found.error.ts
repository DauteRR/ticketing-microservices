import { CommonErrorStructure, CustomError } from './custom.error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public method: string, public path: string) {
    super(`${method} ${path} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): CommonErrorStructure {
    return {
      errors: [{ message: '404 - Not found' }]
    };
  }
}
