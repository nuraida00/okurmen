import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import CoursesSection from '@/components/sections/CoursesSection';
import { useLanguage } from '@/context/LanguageContext';
import type { Course } from '@/types';

interface Props { courses: Course[]; }

export default function CoursesPage({ courses }: Props) {
  const { t } = useLanguage();
  return (
    <Layout title={t.nav.courses}>
      <CoursesSection courses={courses} showViewAll={false} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  let courses: Course[] = [];
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');
      const db = await prisma.course.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });
      courses = JSON.parse(JSON.stringify(db));
    }
  } catch (err) {
    console.warn('[courses/index] DB unavailable:', (err as Error).message);
  }
  return { props: { courses }, revalidate: 60 };
};
