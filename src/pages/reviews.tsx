import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import ReviewsSection from '@/components/sections/ReviewsSection';
import { useLanguage } from '@/context/LanguageContext';
import type { Review } from '@/types';

interface Props { reviews: Review[]; }

export default function ReviewsPage({ reviews }: Props) {
  const { t } = useLanguage();
  return (
    <Layout title={t.nav.reviews}>
      <ReviewsSection reviews={reviews} showViewAll={false} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  let reviews: Review[] = [];
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');
      const db = await prisma.review.findMany({
        where: { isPublished: true },
        include: { course: { select: { id: true, titleKg: true, titleRu: true } } },
        orderBy: { createdAt: 'desc' },
      });
      reviews = JSON.parse(JSON.stringify(db));
    }
  } catch (err) {
    console.warn('[reviews] DB unavailable:', (err as Error).message);
  }
  return { props: { reviews }, revalidate: 60 };
};
