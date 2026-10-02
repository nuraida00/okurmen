import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import type { Course } from '@/types';
import styles from './CourseCard.module.css';

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const { t, lang } = useLanguage();

  const title = lang === 'kg' ? course.titleKg : course.titleRu;
  const desc  = lang === 'kg' ? course.shortDescKg : course.shortDescRu;
  const formatLabel = t.courses.formats[course.format];

  const priceStr = course.price
    ? `${Number(course.price).toLocaleString()} ${course.currency}`
    : null;

  return (
    <article className={styles.card}>
      {/* Image */}
      <div className={styles.imgWrap}>
        {course.image ? (
          <Image
            src={course.image}
            alt={title}
            fill
            className={styles.img}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden>📚</div>
        )}
        <span className={styles.formatBadge}>{formatLabel}</span>
        {course.availableSeats != null && course.availableSeats > 0 && (
          <span className={styles.seatsWrap}>
            {course.availableSeats} {t.courses.seatsAvailable}
          </span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {desc && <p className={styles.desc}>{desc}</p>}

        <div className={styles.meta}>
          {course.duration && (
            <span className={styles.metaItem}>
              <span className={styles.metaIcon} aria-hidden>⏱</span>
              {course.duration}
            </span>
          )}
          <span className={styles.metaItem}>
            <span className={styles.metaIcon} aria-hidden>📍</span>
            {formatLabel}
          </span>
          {course.level && (
            <span className={styles.metaItem}>
              <span className={styles.metaIcon} aria-hidden>📊</span>
              {t.courses.levels[course.level]}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div>
          {priceStr ? (
            <div className={styles.price}>{priceStr}</div>
          ) : (
            <div className={styles.priceSub}>{lang === 'kg' ? 'Баасы суралат' : 'Цена по запросу'}</div>
          )}
        </div>
        <Button as="a" href={`/courses/${course.id}`} variant="primary" size="sm">
          {t.courses.btnDetails}
        </Button>
      </div>
    </article>
  );
}
