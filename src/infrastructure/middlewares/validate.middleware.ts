import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateRequest<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoObj);
    if (errors.length > 0) {
      const errorMessages = errors.map((err) =>
        Object.values(err.constraints ?? {})
      );
      res.status(400).json({ errors: errorMessages.flat() });
      return;
    }

    // Replace body with the validated/transformed object
    req.body = dtoObj;
    next();
  };
}
