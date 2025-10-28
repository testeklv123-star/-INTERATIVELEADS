import { Pool } from 'pg';

export interface UserRecord {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  tenant_db_id: number | null;
  tenant_slug: string | null;
  is_active: boolean;
}

const baseQuery = `
  SELECT
    u.id,
    u.email,
    u.password_hash,
    u.role,
    u.tenant_id AS tenant_db_id,
    t.tenant_id AS tenant_slug,
    u.is_active
  FROM users u
  LEFT JOIN tenants t ON t.id = u.tenant_id
`;

export class AuthRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.pool.query<UserRecord>(`${baseQuery} WHERE u.email = $1`, [email]);
    return result.rows[0] ?? null;
  }

  async findById(id: number): Promise<UserRecord | null> {
    const result = await this.pool.query<UserRecord>(`${baseQuery} WHERE u.id = $1`, [id]);
    return result.rows[0] ?? null;
  }
}
