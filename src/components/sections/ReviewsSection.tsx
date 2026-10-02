import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ReviewCard from './ReviewCard';
import { useLanguage } from '@/context/LanguageContext';
import type { Review } from '@/types';
import styles from './ReviewsSection.module.css';

interface Props {
  reviews: Review[];
  showViewAll?: boolean;
}

export default function ReviewsSection({ reviews, showViewAll = true }: Props) {
  const { t, lang } = useLanguage();

  return (
    <section className={styles.section} id="reviews">
      <div className="container">
        <SectionTitle
          tag={lang === 'kg' ? 'Пикирлер' : 'Отзывы'}
          title={t.reviews.sectionTitle}
          subtitle={t.reviews.sectionSubtitle}
          white
        />

        {reviews.length === 0 ? (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <EmptyState
              title={t.reviews.empty}
              description={t.common.soonContent}
            />
          </div>
        ) : (
          <>
            <div className={styles.scrollWrap}>
              <div className={styles.grid}>
                {reviews.map(r => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    courseName={r.course
                      ? (lang === 'kg' ? r.course.titleKg : r.course.titleRu)
                      : undefined}
                  />
                ))}
              </div>
            </div>

            {showViewAll && (
              <div className={styles.footer}>
                <Button as="a" href="/reviews" variant="outlineWhite" size="lg">
                  {t.common.viewAll}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
