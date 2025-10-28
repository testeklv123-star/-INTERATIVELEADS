import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../errors/appError';

export const requireRoles = (...roles: string[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Sessão não autenticada'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Perfil sem permissão para esta ação'));
    }

    return next();
  };

export const requireTenantAccess = (paramName = 'tenantId') =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Sessão não autenticada'));
    }

    if (req.user.role === 'platform_admin') {
      return next();
    }

    const requestedTenant = req.params[paramName];

    if (!requestedTenant) {
      return next(new BadRequestError('Tenant não informado na rota'));
    }

    const normalizedTenant = requestedTenant.toLowerCase();
    const userTenant = req.user.tenantId?.toLowerCase();

    if (userTenant !== normalizedTenant) {
      return next(new ForbiddenError('Você não tem acesso a este tenant'));
    }

    return next();
  };

export const requireTenantAccessFromBody = (fieldName = 'tenantId') =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Sessão não autenticada'));
    }

    if (req.user.role === 'platform_admin') {
      return next();
    }

    const tenantFromBody = (req.body?.[fieldName] as string | undefined)?.toLowerCase();
    const userTenant = req.user.tenantId?.toLowerCase();

    if (!tenantFromBody) {
      return next(new BadRequestError('Tenant deve ser informado no corpo da requisição'));
    }

    if (userTenant !== tenantFromBody) {
      return next(new ForbiddenError('Você não tem acesso a este tenant'));
    }

    return next();
  };
