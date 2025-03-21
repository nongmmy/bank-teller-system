import { Request, Response, NextFunction } from 'express';
import { logger } from './logger.middleware';

interface CustomError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(`${err.name}: ${err.message}`);

  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message });

  return;
}
