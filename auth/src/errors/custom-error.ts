export interface ErrorInfo {
  message: string;
  field?: string;
}

export interface CommonErrorStructure {
  errors: ErrorInfo[];
}

export abstract class CustomError extends Error {
  public abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeError(): CommonErrorStructure;
}
