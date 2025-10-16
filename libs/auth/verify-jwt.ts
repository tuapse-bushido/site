import { JWTPayload, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const verifyJwt = async (token: string): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error('JWT verify error:', err);
    return null;
  }
};
