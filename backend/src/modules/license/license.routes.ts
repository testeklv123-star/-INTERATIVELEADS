import { Router } from 'express';
import { LicenseController } from './license.controller';

const router = Router();
const licenseController = new LicenseController();

/**
 * Rotas de Licenças
 */

// Validar licença (pública - usada pelo app)
router.post('/validate', licenseController.validateLicense);

// Estatísticas (protegido)
router.get('/stats', licenseController.getStatistics);

// CRUD de licenças (protegido)
router.post('/', licenseController.createLicense);
router.get('/', licenseController.getAllLicenses);
router.get('/:id', licenseController.getLicenseById);
router.patch('/:id/status', licenseController.updateLicenseStatus);
router.post('/:id/renew', licenseController.renewLicense);
router.delete('/:id', licenseController.deleteLicense);

export default router;

