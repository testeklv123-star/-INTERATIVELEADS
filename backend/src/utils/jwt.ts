import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayloadBase {
  sub: string;
  tenantId?: string | null;
  role: string;
}

const buildOptions = (expiresIn: string | number): SignOptions => ({
  expiresIn: expiresIn as SignOptions['expiresIn'],
});

export const signAccessToken = (payload: JwtPayloadBase) =>
  jwt.sign(payload, env.jwtSecret, buildOptions(env.jwtAccessExpiresIn));

export const signRefreshToken = (payload: JwtPayloadBase) =>
  jwt.sign(payload, env.jwtRefreshSecret, buildOptions(env.jwtRefreshExpiresIn));

export const verifyAccessToken = (token: string): JwtPayloadBase => {
  return jwt.verify(token, env.jwtSecret) as JwtPayloadBase;
};

export const verifyRefreshToken = (token: string): JwtPayloadBase => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayloadBase;
};
