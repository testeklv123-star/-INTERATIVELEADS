import { z } from 'zod';

const DEFAULT_DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/interativeleads';
const DEFAULT_JWT_SECRET = 'dev-default-jwt-secret-must-be-overridden-1234567890';
const DEFAULT_JWT_REFRESH_SECRET = 'dev-default-jwt-refresh-secret-override-123456';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL deve ser uma URL válida' }).optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres').optional(),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET deve ter pelo menos 32 caracteres')
    .optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().optional(),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Configuração de ambiente inválida:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Falha na validação das variáveis de ambiente');
  }

  const env = parsed.data;

  const databaseUrl =
    env.DATABASE_URL ?? (env.NODE_ENV === 'production' ? undefined : DEFAULT_DATABASE_URL);

  if (!databaseUrl) {
    throw new Error('DATABASE_URL deve ser configurado. Defina a variável de ambiente ou crie um arquivo backend/.env.');
  }

  const jwtSecret =
    env.JWT_SECRET ?? (env.NODE_ENV === 'production' ? undefined : DEFAULT_JWT_SECRET);

  if (!jwtSecret) {
    throw new Error('JWT_SECRET deve ser configurado nas variáveis de ambiente.');
  }

  const jwtRefreshSecret =
    env.JWT_REFRESH_SECRET ??
    (env.NODE_ENV === 'production' ? undefined : DEFAULT_JWT_REFRESH_SECRET);

  if (!jwtRefreshSecret) {
    throw new Error('JWT_REFRESH_SECRET deve ser configurado nas variáveis de ambiente.');
  }

  if (!env.DATABASE_URL || !env.JWT_SECRET || !env.JWT_REFRESH_SECRET) {
    console.warn(
      '⚠️  Variáveis sensíveis ausentes. Valores padrão de desenvolvimento estão sendo utilizados. Configure-as adequadamente em produção.'
    );
  }

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT ? Number(env.PORT) : 5000,
    databaseUrl,
    jwtSecret,
    jwtRefreshSecret,
    jwtAccessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    corsOrigin: env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()),
  } as const;
};

export const env = parseEnv();
