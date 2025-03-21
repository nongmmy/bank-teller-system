import { NextFunction, Response } from 'express';
import { AuthRequest } from './authen.middleware';

export function authorize(roles: Array<'ADMIN' | 'USER'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permission' });
      return;
    }

    next();
  };
}
