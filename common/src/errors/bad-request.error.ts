import { CustomError, CommonErrorStructure } from './custom.error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError(): CommonErrorStructure {
    return {
      errors: [{ message: this.message }]
    };
  }
}
