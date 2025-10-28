import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { LoginSchema, RefreshTokenSchema } from './auth.schemas';

export const createAuthRouter = (service: AuthService): Router => {
  const router = Router();

  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials = LoginSchema.parse(req.body);
      const result = await service.login(credentials);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = RefreshTokenSchema.parse(req.body);
      const tokens = await service.refresh(refreshToken);
      return res.json(tokens);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
