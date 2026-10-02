import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/sections/Hero';
import WhyUs from '@/components/sections/WhyUs';
import CoursesSection from '@/components/sections/CoursesSection';
import TeamSection from '@/components/sections/TeamSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FormatsSection from '@/components/sections/FormatsSection';
import CtaSection from '@/components/sections/CtaSection';
import type { Course, TeamMember, Review, Feature } from '@/types';

interface Props {
  courses: Course[];
  team: TeamMember[];
  reviews: Review[];
  features: Feature[];
}

export default function HomePage({ courses, team, reviews, features }: Props) {
  return (
    <Layout
      title="OKURMEN — Окуу Борбору"
      description="OKURMEN — заманбап билим берүү борбору. Практикалык билим алып, жаңы мүмкүнчүлүктөргө жол ач."
      heroPage
    >
      <Hero />
      <WhyUs features={features} />
      <CoursesSection courses={courses} showViewAll />
      <FormatsSection />
      <TeamSection members={team} showViewAll />
      <ReviewsSection reviews={reviews} showViewAll />
      <CtaSection />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Try to fetch from DB; gracefully fall back to empty arrays if DB is unavailable.
  let courses:  Course[]     = [];
  let team:     TeamMember[] = [];
  let reviews:  Review[]     = [];
  let features: Feature[]    = [];

  try {
    // Only attempt DB access if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');

      const [dbCourses, dbTeam, dbReviews, dbFeatures] = await Promise.all([
        prisma.course.findMany({
          where: { isPublished: true },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          take: 6,
        }),
        prisma.teamMember.findMany({
          where: { isPublished: true },
          include: { department: true },
          orderBy: [{ sortOrder: 'asc' }],
          take: 8,
        }),
        prisma.review.findMany({
          where: { isPublished: true },
          include: { course: { select: { id: true, titleKg: true, titleRu: true } } },
          orderBy: { createdAt: 'desc' },
          take: 6,
        }),
        prisma.feature.findMany({
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        }),
      ]);

      courses  = JSON.parse(JSON.stringify(dbCourses));
      team     = JSON.parse(JSON.stringify(dbTeam));
      reviews  = JSON.parse(JSON.stringify(dbReviews));
      features = JSON.parse(JSON.stringify(dbFeatures));
    }
  } catch (err) {
    console.warn('[getStaticProps] DB unavailable, returning empty data:', (err as Error).message);
  }

  return {
    props: { courses, team, reviews, features },
    revalidate: 60,
  };
};
