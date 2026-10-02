import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'PUT') {
    try {
      const { name, photo, textKg, textRu, rating, courseId, isPublished } = req.body;
      const review = await prisma.review.update({
        where: { id },
        data: {
          ...(name        !== undefined && { name }),
          ...(photo       !== undefined && { photo: photo || null }),
          ...(textKg      !== undefined && { textKg }),
          ...(textRu      !== undefined && { textRu }),
          ...(rating      !== undefined && { rating: Number(rating) }),
          ...(courseId    !== undefined && { courseId: courseId || null }),
          ...(isPublished !== undefined && { isPublished }),
        },
      });
      return res.status(200).json({ success: true, data: review });
    } catch (err) {
      console.error('[PUT /api/reviews/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existing = await prisma.review.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ success: false, error: 'Not found' });

      await prisma.review.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[DELETE /api/reviews/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
