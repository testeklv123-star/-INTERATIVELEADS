import { Router, Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import {
  TenantConfigCreateSchema,
  TenantConfigUpdateSchema,
} from './tenant.schemas';
import { authenticate } from '../../middlewares/authMiddleware';
import {
  requireRoles,
  requireTenantAccess,
  requireTenantAccessFromBody,
} from '../../middlewares/authorization';

export const createTenantRouter = (service: TenantService): Router => {
  const router = Router();

  router.use(authenticate);

  router.get('/:tenantId', requireTenantAccess(), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant = await service.getTenant(req.params.tenantId);
      if (!tenant) {
        return res.status(404).json({ message: 'Tenant não encontrado' });
      }
      return res.json(tenant);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', requireRoles('platform_admin'), requireTenantAccessFromBody(), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = TenantConfigCreateSchema.parse(req.body);
      const tenant = await service.createTenant(input);
      return res.status(201).json(tenant);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:tenantId', requireTenantAccess(), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = TenantConfigUpdateSchema.parse({ ...req.body, tenantId: req.params.tenantId });
      const tenant = await service.updateTenant(req.params.tenantId, input);
      if (!tenant) {
        return res.status(404).json({ message: 'Tenant não encontrado' });
      }
      return res.json(tenant);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:tenantId', requireRoles('platform_admin'), requireTenantAccess(), async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.deleteTenant(req.params.tenantId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
