import { NextFunction, Request, Response } from 'express';
import { CustomError, CommonErrorStructure } from '../errors/custom-error';
import { UnknownError } from '../errors/unknown-error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<CommonErrorStructure>,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    console.error(err);
    res.status(err.statusCode).send(err.serializeError());
  } else {
    console.error('[Unknown error]', err);
    const { statusCode, serializeError } = new UnknownError();
    res.status(statusCode).send(serializeError());
  }
}
