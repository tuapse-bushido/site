import { jwtVerify, SignJWT } from 'jose';
import { AccessPayload, sessionSchemas } from 'modules/admin/admin-auth/entities';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return new TextEncoder().encode(secret);
}

export const tokenService = {
  async verifyAccessToken(token: string): Promise<AccessPayload | null> {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret(), {
        algorithms: ['HS256'],
        issuer: 'bushido',
        audience: 'bushido-admin',
      });

      const parsed = sessionSchemas.token.accessPayload.safeParse(payload);

      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  },

  async createAccessToken(payload: AccessPayload): Promise<string> {
    return new SignJWT({
      sid: payload.sid,
      role: payload.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.sub)
      .setIssuer('bushido')
      .setAudience('bushido-admin')
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(getJwtSecret());
  },
};
