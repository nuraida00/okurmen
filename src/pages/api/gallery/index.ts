import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const category = req.query.category as string | undefined;
      const items = await prisma.gallery.findMany({
        where: { isPublished: true, ...(category ? { category: category as never } : {}) },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    try {
      const item = await prisma.gallery.create({ data: req.body });
      return res.status(201).json({ success: true, data: item });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
