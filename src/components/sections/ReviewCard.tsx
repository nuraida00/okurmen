import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { Review } from '@/types';
import styles from './ReviewCard.module.css';

interface Props {
  review: Review;
  courseName?: string;
}

export default function ReviewCard({ review, courseName }: Props) {
  const { lang } = useLanguage();

  const text    = lang === 'kg' ? review.textKg : review.textRu;
  const initials = review.name.split(' ').map(p => p[0]).slice(0, 2).join('');

  return (
    <article className={styles.card}>
      <div className={styles.quote} aria-hidden>"</div>

      {/* Stars */}
      <div className={styles.stars} aria-label={`Рейтинг ${review.rating} из 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden>{i < review.rating ? '★' : '☆'}</span>
        ))}
      </div>

      {/* Text */}
      <p className={styles.text}>{text}</p>

      {/* Author */}
      <div className={styles.author}>
        <div className={styles.avatar}>
          {review.photo ? (
            <Image src={review.photo} alt={review.name} width={44} height={44} style={{ objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            <span aria-hidden>{initials}</span>
          )}
        </div>
        <div>
          <div className={styles.authorName}>{review.name}</div>
          {courseName && <div className={styles.authorSub}>{courseName}</div>}
        </div>
      </div>
    </article>
  );
}
