import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/appError';
import { verifyAccessToken, JwtPayloadBase } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayloadBase;
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Token não fornecido'));
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return next(new UnauthorizedError('Token inválido'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Token inválido'));
  }
};
