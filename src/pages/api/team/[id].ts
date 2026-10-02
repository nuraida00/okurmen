import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  // ── PUT — whitelisted fields only ─────────────────────────────────────────
  if (req.method === 'PUT') {
    try {
      const {
        nameKg, nameRu, positionKg, positionRu,
        descriptionKg, descriptionRu, experience, photo,
        instagram, telegram, whatsapp, facebook,
        sortOrder, isPublished, departmentId,
      } = req.body;

      const member = await prisma.teamMember.update({
        where: { id },
        data: {
          ...(nameKg        !== undefined && { nameKg }),
          ...(nameRu        !== undefined && { nameRu }),
          ...(positionKg    !== undefined && { positionKg }),
          ...(positionRu    !== undefined && { positionRu }),
          ...(descriptionKg !== undefined && { descriptionKg }),
          ...(descriptionRu !== undefined && { descriptionRu }),
          ...(experience    !== undefined && { experience }),
          ...(photo         !== undefined && { photo }),
          ...(instagram     !== undefined && { instagram }),
          ...(telegram      !== undefined && { telegram }),
          ...(whatsapp      !== undefined && { whatsapp }),
          ...(facebook      !== undefined && { facebook }),
          ...(sortOrder     !== undefined && { sortOrder }),
          ...(isPublished   !== undefined && { isPublished }),
          ...(departmentId  !== undefined && { departmentId: departmentId || null }),
        },
      });
      return res.status(200).json({ success: true, data: member });
    } catch (err) {
      console.error('[PUT /api/team/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    try {
      const existing = await prisma.teamMember.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ success: false, error: 'Not found' });

      await prisma.teamMember.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[DELETE /api/team/:id]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
