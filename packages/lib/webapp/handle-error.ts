import { Response } from 'express';
import { ApplicationError, HTTP_NOT_FOUND } from '../utils/errors.js';
import { logger } from '../utils/logger.js';


export function handleError(err: Error, res: Response) {
  const status = err instanceof ApplicationError ? err.status : HTTP_NOT_FOUND;
  const payload = err instanceof ApplicationError ? err.payload : undefined;
  const message = err.message ?? err.name ?? 'Unknown error';
  res.status(status).json({ status: 'error', message, payload });
  logger.error(message + '\n' + err?.stack);
}
