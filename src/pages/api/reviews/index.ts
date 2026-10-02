import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // ?published=false → admin view (all records); default → public (published only)
    const publishedOnly = req.query.published !== 'false';

    // Admin-only for unpublished
    if (!publishedOnly) {
      const admin = requireAdmin(req, res);
      if (!admin) return;
    }

    try {
      const reviews = await prisma.review.findMany({
        where: publishedOnly ? { isPublished: true } : {},
        include: { course: { select: { id: true, titleKg: true, titleRu: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      console.error('[GET /api/reviews]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    try {
      const { name, photo, textKg, textRu, rating, courseId, isPublished } = req.body;
      if (!name?.trim()) {
        return res.status(400).json({ success: false, error: 'name is required' });
      }
      const review = await prisma.review.create({
        data: {
          name:        name.trim(),
          photo:       photo       || null,
          textKg:      textKg      || null,
          textRu:      textRu      || null,
          rating:      Number(rating) || 5,
          courseId:    courseId    || null,
          isPublished: isPublished ?? false,
        },
      });
      return res.status(201).json({ success: true, data: review });
    } catch (err) {
      console.error('[POST /api/reviews]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
