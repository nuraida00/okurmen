import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback-secret-change-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN ?? '7d';

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as jwt.SignOptions);
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Middleware helper — returns admin payload or sends 401
export function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): AdminPayload | null {
  const auth = req.headers.authorization;
  const cookieToken = req.cookies?.['okurmen_admin_token'];
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : cookieToken;

  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return null;
  }

  return payload;
}
