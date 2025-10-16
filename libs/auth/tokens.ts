import { JWTPayload, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const createAccessToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('2m').sign(JWT_SECRET);
};
