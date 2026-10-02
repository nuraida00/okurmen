import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const publishedOnly = req.query.published !== 'false';
      const members = await prisma.teamMember.findMany({
        where: publishedOnly ? { isPublished: true } : {},
        include: { department: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
      return res.status(200).json({ success: true, data: members });
    } catch (err) {
      console.error('[GET /api/team]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    try {
      const {
        nameKg, nameRu, positionKg, positionRu,
        descriptionKg, descriptionRu, experience, photo,
        instagram, telegram, whatsapp, facebook,
        sortOrder, isPublished, departmentId,
      } = req.body;

      if (!nameKg?.trim() || !nameRu?.trim() || !positionKg?.trim() || !positionRu?.trim()) {
        return res.status(400).json({ success: false, error: 'nameKg, nameRu, positionKg, positionRu are required' });
      }

      const member = await prisma.teamMember.create({
        data: {
          nameKg:        nameKg.trim(),
          nameRu:        nameRu.trim(),
          positionKg:    positionKg.trim(),
          positionRu:    positionRu.trim(),
          descriptionKg: descriptionKg ?? null,
          descriptionRu: descriptionRu ?? null,
          experience:    experience    ?? null,
          photo:         photo         ?? null,
          instagram:     instagram     ?? null,
          telegram:      telegram      ?? null,
          whatsapp:      whatsapp      ?? null,
          facebook:      facebook      ?? null,
          sortOrder:     sortOrder     ?? 0,
          isPublished:   isPublished   ?? true,
          departmentId:  departmentId  ?? null,
        },
      });
      return res.status(201).json({ success: true, data: member });
    } catch (err) {
      console.error('[POST /api/team]', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
