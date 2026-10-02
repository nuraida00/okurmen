import Link from 'next/link';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import CourseCard from './CourseCard';
import { useLanguage } from '@/context/LanguageContext';
import type { Course } from '@/types';
import styles from './CoursesSection.module.css';

interface Props {
  courses: Course[];
  showViewAll?: boolean;
}

export default function CoursesSection({ courses, showViewAll = true }: Props) {
  const { t, lang } = useLanguage();

  return (
    <section className={styles.section} id="courses">
      <div className="container">
        <SectionTitle
          tag={lang === 'kg' ? 'Окуу' : 'Обучение'}
          title={t.courses.sectionTitle}
          subtitle={t.courses.sectionSubtitle}
        />

        {courses.length === 0 ? (
          <EmptyState
            title={t.courses.empty}
            description={t.common.soonContent}
          />
        ) : (
          <>
            <div className={styles.gridScrollWrap}>
              <div className={styles.grid}>
                {courses.map(c => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </div>

            {showViewAll && (
              <div className={styles.footer}>
                <Button as="a" href="/courses" variant="outline" size="lg">
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
