import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../../domain/models/user';

export interface AuthRequest extends Request {
  user?: User;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as User;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}
