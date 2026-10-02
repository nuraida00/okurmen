import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const links = await prisma.socialLink.findMany({ where: { isActive: true } });
      return res.status(200).json({ success: true, data: links });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'PUT') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    try {
      const { platform, url, isActive } = req.body;
      const link = await prisma.socialLink.upsert({
        where:  { platform },
        update: { url, isActive: isActive ?? true },
        create: { platform, url, isActive: isActive ?? true },
      });
      return res.status(200).json({ success: true, data: link });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
