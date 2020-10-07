export interface ErrorInfo {
  message: string;
  field?: string;
}

export interface CommonErrorStructure {
  errors: ErrorInfo[];
}

export abstract class BaseError extends Error {
  public abstract statusCode: number;

  constructor() {
    super();
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeError(): CommonErrorStructure;
}
