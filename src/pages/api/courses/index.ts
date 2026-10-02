import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const publishedOnly = req.query.published !== 'false';
      const courses = await prisma.course.findMany({
        where: publishedOnly ? { isPublished: true } : {},
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });
      return res.status(200).json({ success: true, data: courses });
    } catch (err) {
      console.error('[GET /api/courses]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    try {
      const {
        titleKg, titleRu, descriptionKg, descriptionRu,
        shortDescKg, shortDescRu, price, currency, duration,
        format, level, totalSeats, availableSeats, image,
        requirementsKg, requirementsRu, isPublished, sortOrder,
      } = req.body;

      if (!titleKg?.trim() || !titleRu?.trim()) {
        return res.status(400).json({ success: false, error: 'titleKg and titleRu are required' });
      }

      const course = await prisma.course.create({
        data: {
          titleKg:        titleKg.trim(),
          titleRu:        titleRu.trim(),
          descriptionKg:  descriptionKg  ?? null,
          descriptionRu:  descriptionRu  ?? null,
          shortDescKg:    shortDescKg    ?? null,
          shortDescRu:    shortDescRu    ?? null,
          price:          price          ?? null,
          currency:       currency       ?? 'KGS',
          duration:       duration       ?? null,
          format:         format         ?? 'OFFLINE',
          level:          level          ?? 'BEGINNER',
          totalSeats:     totalSeats     ?? null,
          availableSeats: availableSeats ?? null,
          image:          image          ?? null,
          requirementsKg: requirementsKg ?? null,
          requirementsRu: requirementsRu ?? null,
          isPublished:    isPublished    ?? false,
          sortOrder:      sortOrder      ?? 0,
        },
      });
      return res.status(201).json({ success: true, data: course });
    } catch (err) {
      console.error('[POST /api/courses]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
