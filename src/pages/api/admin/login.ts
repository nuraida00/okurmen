import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [{ email }, { username: email }],
        isActive: true,
      },
      select: {
        id:           true,
        email:        true,
        username:     true,
        name:         true,
        role:         true,
        isActive:     true,
        passwordHash: true, // needed for comparePassword only
      },
    });

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = signToken({ id: admin.id, email: admin.email, role: admin.role });

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `okurmen_admin_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Strict`,
    ]);

    return res.status(200).json({
      success: true,
      // Never return passwordHash to the client
      data: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
