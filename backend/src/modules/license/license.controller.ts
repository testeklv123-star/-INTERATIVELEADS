import { Request, Response } from 'express';
import { LicenseService } from './license.service';
import { LicenseType, LicenseStatus } from './license.entity';

export class LicenseController {
  private licenseService: LicenseService;

  constructor() {
    this.licenseService = new LicenseService();
  }

  /**
   * Cria uma nova licença
   * POST /api/licenses
   */
  createLicense = async (req: Request, res: Response) => {
    try {
      const { tenant_id, client_name, client_email, client_phone, license_type, max_devices, duration_days } = req.body;

      if (!tenant_id || !client_name || !license_type) {
        return res.status(400).json({
          success: false,
          message: 'tenant_id, client_name e license_type são obrigatórios'
        });
      }

      const license = await this.licenseService.createLicense({
        tenant_id,
        client_name,
        client_email,
        client_phone,
        license_type: license_type as LicenseType,
        max_devices,
        duration_days
      });

      return res.status(201).json({
        success: true,
        message: 'Licença criada com sucesso',
        data: license
      });
    } catch (error) {
      console.error('❌ Erro ao criar licença:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar licença',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Valida uma licença
   * POST /api/licenses/validate
   */
  validateLicense = async (req: Request, res: Response) => {
    try {
      const { license_key, device_id } = req.body;

      if (!license_key || !device_id) {
        return res.status(400).json({
          success: false,
          message: 'license_key e device_id são obrigatórios'
        });
      }

      const result = await this.licenseService.validateLicense(license_key, device_id);

      if (!result.valid) {
        return res.status(403).json({
          success: false,
          message: result.message,
          data: result.license
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.license
      });
    } catch (error) {
      console.error('❌ Erro ao validar licença:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao validar licença',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Lista todas as licenças
   * GET /api/licenses
   */
  getAllLicenses = async (req: Request, res: Response) => {
    try {
      const { status, tenant_id } = req.query;

      const licenses = await this.licenseService.getAllLicenses({
        status: status as LicenseStatus,
        tenant_id: tenant_id as string
      });

      return res.status(200).json({
        success: true,
        data: licenses,
        count: licenses.length
      });
    } catch (error) {
      console.error('❌ Erro ao listar licenças:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar licenças',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Busca licença por ID
   * GET /api/licenses/:id
   */
  getLicenseById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const license = await this.licenseService.getLicenseById(id);

      if (!license) {
        return res.status(404).json({
          success: false,
          message: 'Licença não encontrada'
        });
      }

      return res.status(200).json({
        success: true,
        data: license
      });
    } catch (error) {
      console.error('❌ Erro ao buscar licença:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar licença',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Atualiza status da licença
   * PATCH /api/licenses/:id/status
   */
  updateLicenseStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(LicenseStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
      }

      const license = await this.licenseService.updateLicenseStatus(id, status);

      return res.status(200).json({
        success: true,
        message: 'Status atualizado com sucesso',
        data: license
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar status',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Renova licença
   * POST /api/licenses/:id/renew
   */
  renewLicense = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { duration_days } = req.body;

      if (!duration_days || duration_days <= 0) {
        return res.status(400).json({
          success: false,
          message: 'duration_days deve ser maior que 0'
        });
      }

      const license = await this.licenseService.renewLicense(id, duration_days);

      return res.status(200).json({
        success: true,
        message: 'Licença renovada com sucesso',
        data: license
      });
    } catch (error) {
      console.error('❌ Erro ao renovar licença:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao renovar licença',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Deleta licença
   * DELETE /api/licenses/:id
   */
  deleteLicense = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await this.licenseService.deleteLicense(id);

      return res.status(200).json({
        success: true,
        message: 'Licença deletada com sucesso'
      });
    } catch (error) {
      console.error('❌ Erro ao deletar licença:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar licença',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Estatísticas de licenças
   * GET /api/licenses/stats
   */
  getStatistics = async (req: Request, res: Response) => {
    try {
      const stats = await this.licenseService.getStatistics();

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}

