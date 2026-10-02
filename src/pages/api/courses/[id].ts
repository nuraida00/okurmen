import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

  // ── GET — public ─────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          modules:   { orderBy: { sortOrder: 'asc' } },
          schedules: { where: { isActive: true }, orderBy: { startDate: 'asc' } },
          teachers:  { select: { id: true, nameKg: true, nameRu: true, photo: true, positionKg: true, positionRu: true } },
          reviews:   { where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 10 },
        },
      });
      if (!course) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: course });
    } catch (err) {
      console.error('[GET /api/courses/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  const admin = requireAdmin(req, res);
  if (!admin) return;

  // ── PUT — admin only, whitelisted fields ──────────────────────────────────
  if (req.method === 'PUT') {
    try {
      const {
        titleKg, titleRu, descriptionKg, descriptionRu,
        shortDescKg, shortDescRu, price, currency, duration,
        format, level, totalSeats, availableSeats, image,
        requirementsKg, requirementsRu, isPublished, sortOrder,
      } = req.body;

      const course = await prisma.course.update({
        where: { id },
        data: {
          ...(titleKg        !== undefined && { titleKg }),
          ...(titleRu        !== undefined && { titleRu }),
          ...(descriptionKg  !== undefined && { descriptionKg }),
          ...(descriptionRu  !== undefined && { descriptionRu }),
          ...(shortDescKg    !== undefined && { shortDescKg }),
          ...(shortDescRu    !== undefined && { shortDescRu }),
          ...(price          !== undefined && { price: price !== null ? price : null }),
          ...(currency       !== undefined && { currency }),
          ...(duration       !== undefined && { duration }),
          ...(format         !== undefined && { format }),
          ...(level          !== undefined && { level }),
          ...(totalSeats     !== undefined && { totalSeats }),
          ...(availableSeats !== undefined && { availableSeats }),
          ...(image          !== undefined && { image }),
          ...(requirementsKg !== undefined && { requirementsKg }),
          ...(requirementsRu !== undefined && { requirementsRu }),
          ...(isPublished    !== undefined && { isPublished }),
          ...(sortOrder      !== undefined && { sortOrder }),
        },
      });
      return res.status(200).json({ success: true, data: course });
    } catch (err) {
      console.error('[PUT /api/courses/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  // ── DELETE — block if active bookings exist ───────────────────────────────
  if (req.method === 'DELETE') {
    try {
      const activeBookings = await prisma.booking.count({
        where: {
          courseId: id,
          status: { in: ['PENDING', 'CONFIRMED', 'PAID'] },
        },
      });

      if (activeBookings > 0) {
        return res.status(409).json({
          success: false,
          error: `Курста ${activeBookings} активдүү бронь бар. Алды менен броньдорду жокко чыгарыңыз.`,
        });
      }

      await prisma.course.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[DELETE /api/courses/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
