import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    const [
      totalCourses,
      totalTeam,
      totalStudents,
      totalGraduates,
      totalBookings,
      pendingBookings,
      paidBookings,
      totalReviews,
    ] = await Promise.all([
      prisma.course.count(),
      prisma.teamMember.count(),
      prisma.student.count(),
      prisma.graduate.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'PAID' } }),
      prisma.review.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalTeam,
        totalStudents,
        totalGraduates,
        totalBookings,
        pendingBookings,
        paidBookings,
        totalReviews,
      },
    });
  } catch (err) {
    console.error('[GET /api/admin/stats]', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
