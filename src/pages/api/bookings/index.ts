import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { sendBookingNotification } from '@/lib/telegram';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ── Public POST — create booking ──────────────────────────────────────────
  if (req.method === 'POST') {
    const {
      firstName, lastName, phone, email,
      courseId, format, groupName, participants, comment,
    } = req.body as Record<string, string>;

    // Validation
    if (!firstName?.trim() || !lastName?.trim() || !phone?.trim() || !courseId?.trim()) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }
    if (!/^\+?[\d\s\-()\u00A0]{7,}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, error: 'Invalid phone number' });
    }

    // DB unavailable — still tell user we got their request
    if (!process.env.DATABASE_URL) {
      // Telegram-only fallback when no DB
      sendBookingNotification({
        studentName: `${firstName} ${lastName}`,
        phone: phone.trim(),
        course: courseId,
        format: format ?? 'OFFLINE',
        status: 'PENDING (no DB)',
        date: new Date().toLocaleString('ru-RU'),
      }).catch(console.error);

      return res.status(200).json({
        success: true,
        data: { id: 'no-db' },
        message: 'Booking received (database not configured)',
      });
    }

    try {
      const course = await prisma.course.findUnique({ where: { id: courseId } });

      const booking = await prisma.booking.create({
        data: {
          firstName:    firstName.trim(),
          lastName:     lastName.trim(),
          phone:        phone.trim(),
          email:        email?.trim()    || null,
          courseId,
          format:       (format as never) ?? 'OFFLINE',
          groupName:    groupName?.trim() || null,
          participants: Number(participants) || 1,
          comment:      comment?.trim()  || null,
          amount:       course?.price    ?? null,
          currency:     course?.currency ?? 'KGS',
          status:       'PENDING',
        },
      });

      // Non-blocking Telegram notification
      sendBookingNotification({
        studentName: `${firstName} ${lastName}`,
        phone: phone.trim(),
        course:  course?.titleRu ?? courseId,
        format:  format ?? 'OFFLINE',
        amount:  course?.price
          ? `${Number(course.price).toLocaleString()} ${course.currency}`
          : undefined,
        status: 'PENDING',
        date: new Date().toLocaleString('ru-RU'),
      }).catch(console.error);

      return res.status(201).json({ success: true, data: { id: booking.id } });
    } catch (err) {
      console.error('[POST /api/bookings]', err);
      return res.status(500).json({ success: false, error: 'Ката кетти. Кайра аракет кылыңыз.' });
    }
  }

  // ── Admin GET — list bookings ──────────────────────────────────────────────
  if (req.method === 'GET') {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    try {
      const page     = Math.max(1, Number(req.query.page)     || 1);
      const pageSize = Math.min(100, Number(req.query.pageSize) || 20);
      const status   = req.query.status as string | undefined;

      const where = status && status !== 'all' ? { status: status as never } : {};
      const [items, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          skip:    (page - 1) * pageSize,
          take:    pageSize,
          orderBy: { createdAt: 'desc' },
          include: {
            course:  { select: { titleKg: true, titleRu: true } },
            payment: { select: { status: true, amount: true } },
          },
        }),
        prisma.booking.count({ where }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          items, total, page, pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (err) {
      console.error('[GET /api/bookings]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
