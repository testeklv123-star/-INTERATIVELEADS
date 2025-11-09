import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env';
import { AppDataSource } from './db/data-source';
import { buildTenantRouter } from './modules/tenant';
import { buildAuthRouter } from './modules/auth';
import licenseRoutes from './modules/license/license.routes';
import { AppError } from './errors/appError';

const app = express();

// Inicializar TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Conectado ao PostgreSQL via TypeORM');
  })
  .catch((error) => {
    console.error('❌ Falha ao conectar ao PostgreSQL via TypeORM:', error);
    process.exit(1);
  });

app.use(helmet());
app.use(cors({ origin: env.corsOrigin || '*' }));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/auth', buildAuthRouter(AppDataSource));
app.use('/tenants', buildTenantRouter(AppDataSource));
app.use('/api/licenses', licenseRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Erro não tratado:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  return res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`API InterativeLeads rodando na porta ${PORT}`);
});
