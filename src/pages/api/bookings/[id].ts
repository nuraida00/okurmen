import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const ALLOWED_STATUSES = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'COMPLETED'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  // ── GET single booking ────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          course:  { select: { titleKg: true, titleRu: true } },
          payment: true,
        },
      });
      if (!booking) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: booking });
    } catch (err) {
      console.error('[GET /api/bookings/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  // ── PUT — only status and comment ────────────────────────────────────────
  if (req.method === 'PUT') {
    try {
      const { status, comment } = req.body as { status?: string; comment?: string };

      if (status && !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, error: `Invalid status: ${status}` });
      }

      const booking = await prisma.booking.update({
        where: { id },
        data: {
          ...(status  !== undefined && { status }),
          ...(comment !== undefined && { comment }),
        },
        include: { course: { select: { titleKg: true, titleRu: true } } },
      });
      return res.status(200).json({ success: true, data: booking });
    } catch (err) {
      console.error('[PUT /api/bookings/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
