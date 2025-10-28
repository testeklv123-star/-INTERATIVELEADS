import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../../errors/appError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AuthRepository } from './auth.repository';
import { LoginInput } from './auth.schemas';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  tenantId: string | null;
}

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async login(credentials: LoginInput): Promise<AuthTokens & { user: AuthUser }> {
    const email = credentials.email.toLowerCase();
    const userRecord = await this.repository.findByEmail(email);

    if (!userRecord || !userRecord.is_active) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const passwordMatches = await bcrypt.compare(
      credentials.password,
      userRecord.password_hash
    );

    if (!passwordMatches) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const payload = {
      sub: String(userRecord.id),
      tenantId: userRecord.tenant_slug,
      role: userRecord.role,
    } as const;

    const tokens = {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };

    return {
      ...tokens,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        role: userRecord.role,
        tenantId: userRecord.tenant_slug,
      },
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const userId = Number(payload.sub);
      const userRecord = await this.repository.findById(userId);

      if (!userRecord || !userRecord.is_active) {
        throw new UnauthorizedError('Sessão inválida');
      }

      const newPayload = {
        sub: String(userRecord.id),
        tenantId: userRecord.tenant_slug,
        role: userRecord.role,
      } as const;

      return {
        accessToken: signAccessToken(newPayload),
        refreshToken: signRefreshToken(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedError('Token de atualização inválido');
    }
  }
}
