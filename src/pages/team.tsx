import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import TeamSection from '@/components/sections/TeamSection';
import { useLanguage } from '@/context/LanguageContext';
import type { TeamMember } from '@/types';

interface Props { team: TeamMember[]; }

export default function TeamPage({ team }: Props) {
  const { t } = useLanguage();
  return (
    <Layout title={t.nav.team}>
      <TeamSection members={team} showViewAll={false} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  let team: TeamMember[] = [];
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');
      const db = await prisma.teamMember.findMany({
        where: { isPublished: true },
        include: { department: true },
        orderBy: [{ sortOrder: 'asc' }],
      });
      team = JSON.parse(JSON.stringify(db));
    }
  } catch (err) {
    console.warn('[team] DB unavailable:', (err as Error).message);
  }
  return { props: { team }, revalidate: 60 };
};
