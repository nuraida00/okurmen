import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'okurmen_admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
  return res.status(200).json({ success: true });
}
