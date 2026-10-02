import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const graduates = await prisma.graduate.findMany({
        where: { isPublished: true },
        include: {
          course:  { select: { id: true, titleKg: true, titleRu: true } },
          company: { select: { id: true, name: true, logo: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ success: true, data: graduates });
    } catch (err) {
      console.error('[GET /api/graduates]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    try {
      const graduate = await prisma.graduate.create({
        data: { ...req.body, isPublished: req.body.isPublished ?? false },
      });
      return res.status(201).json({ success: true, data: graduate });
    } catch (err) {
      console.error('[POST /api/graduates]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
