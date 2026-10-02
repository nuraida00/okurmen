import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import type { Course } from '@/types';
import styles from './[id].module.css';

interface Props {
  course: Course | null;
}

export default function CourseDetailPage({ course }: Props) {
  const { t, lang } = useLanguage();

  if (!course) {
    return (
      <Layout title="Курс табылган жок">
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            {lang === 'kg' ? 'Курс табылган жок' : 'Курс не найден'}
          </h1>
          <Link href="/courses" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            ← {t.nav.courses}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = lang === 'kg' ? course.titleKg : course.titleRu;
  const desc  = lang === 'kg' ? course.descriptionKg : course.descriptionRu;
  const reqs  = lang === 'kg' ? course.requirementsKg : course.requirementsRu;

  const priceStr = course.price
    ? `${Number(course.price).toLocaleString()} ${course.currency}`
    : (lang === 'kg' ? 'Баасы суралат' : 'Цена по запросу');

  return (
    <Layout title={title} description={desc ?? undefined}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <Link href="/courses" className={styles.back}>
            ← {t.nav.courses}
          </Link>

          <div className={styles.heroInner}>
            <div>
              <div className={styles.badge}>
                {t.courses.formats[course.format]}
              </div>
              <h1 className={styles.title}>{title}</h1>
              {desc && <p className={styles.desc}>{desc}</p>}

              <div className={styles.metaRow}>
                {course.duration && (
                  <span className={styles.metaItem}>⏱ {course.duration}</span>
                )}
                <span className={styles.metaItem}>
                  📍 {t.courses.formats[course.format]}
                </span>
                {course.availableSeats != null && (
                  <span className={styles.metaItem}>
                    🪑 {course.availableSeats} {t.courses.seatsAvailable}
                  </span>
                )}
              </div>

              <Button as="a" href={`/booking/${course.id}`} variant="orange" size="lg">
                {t.courses.btnBook}
              </Button>
            </div>

            <div>
              <div className={styles.imgWrap}>
                {course.image ? (
                  <Image src={course.image} alt={title} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.imgPlaceholder} aria-hidden>📚</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Main */}
            <div>
              {reqs && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    {lang === 'kg' ? 'Талаптар' : 'Требования'}
                  </h2>
                  <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.75 }}>{reqs}</p>
                </div>
              )}

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {lang === 'kg' ? 'Программа' : 'Программа курса'}
                </h2>
                <div className={styles.moduleList}>
                  <div className={styles.moduleItem}>
                    <div className={styles.moduleNum}>1</div>
                    <div className={styles.moduleTitle}>{lang === 'kg' ? 'Маалымат жакында кошулат' : 'Информация скоро будет добавлена'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.sideCard}>
                <div className={styles.sideCardTitle}>
                  {lang === 'kg' ? 'Курс жөнүндө' : 'О курсе'}
                </div>
                {course.duration && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t.courses.duration}</span>
                    <span className={styles.infoValue}>{course.duration}</span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>{t.courses.format}</span>
                  <span className={styles.infoValue}>{t.courses.formats[course.format]}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>{t.courses.level}</span>
                  <span className={styles.infoValue}>{t.courses.levels[course.level]}</span>
                </div>
                {course.totalSeats && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t.courses.seats}</span>
                    <span className={styles.infoValue}>{course.totalSeats}</span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>{t.courses.price}</span>
                  <span className={styles.infoValue} style={{ color: 'var(--color-primary)' }}>{priceStr}</span>
                </div>
              </div>

              <div className={styles.bookCard}>
                <div className={styles.bookCardTitle}>{t.courses.btnBook}</div>
                <div className={styles.bookCardSub}>{priceStr}</div>
                <Button as="a" href={`/booking/${course.id}`} variant="orange" size="md" fullWidth>
                  {t.courses.btnBook}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = params?.id as string;
  if (!id) return { props: { course: null } };

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import('@/lib/prisma');
      const db = await prisma.course.findUnique({
        where: { id },
        include: {
          modules:   { orderBy: { sortOrder: 'asc' } },
          schedules: { where: { isActive: true } },
          teachers:  true,
        },
      });
      if (db) return { props: { course: JSON.parse(JSON.stringify(db)) } };
    } catch {
      // DB unavailable — show not found
    }
  }

  return { props: { course: null } };
};
