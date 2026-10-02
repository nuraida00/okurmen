import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import SectionTitle from '@/components/ui/SectionTitle';
import EmptyState from '@/components/ui/EmptyState';
import { useLanguage } from '@/context/LanguageContext';
import type { Graduate } from '@/types';
import styles from './graduates.module.css';

interface Props { graduates: Graduate[]; }

export default function GraduatesPage({ graduates }: Props) {
  const { t, lang } = useLanguage();

  return (
    <Layout title={t.nav.graduates}>
      <section className={styles.hero}>
        <div className="container">
          <SectionTitle
            tag="OKURMEN"
            title={t.graduates.sectionTitle}
            subtitle={t.graduates.sectionSubtitle}
            white
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          {graduates.length === 0 ? (
            <EmptyState title={t.graduates.empty} description={t.common.soonContent} />
          ) : (
            <div className={styles.grid}>
              {graduates.map(g => {
                const desc = lang === 'kg' ? g.descriptionKg : g.descriptionRu;
                return (
                  <article key={g.id} className={styles.card}>
                    <div className={styles.imgWrap}>
                      {g.photo ? (
                        <Image src={g.photo} alt={g.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className={styles.imgPlaceholder} aria-hidden>
                          {g.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={styles.body}>
                      <h3 className={styles.name}>{g.name}</h3>
                      {g.currentPosition && <p className={styles.position}>{g.currentPosition}</p>}
                      {g.company && <p className={styles.company}>{t.graduates.worksAt}: {g.company.name}</p>}
                      {g.course && (
                        <span className={styles.courseBadge}>
                          {lang === 'kg' ? g.course.titleKg : g.course.titleRu}
                        </span>
                      )}
                      {g.graduationYear && <p className={styles.year}>{g.graduationYear}</p>}
                      {desc && <p className={styles.desc}>{desc}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  let graduates: Graduate[] = [];
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');
      const db = await prisma.graduate.findMany({
        where: { isPublished: true },
        include: {
          course:  { select: { id: true, titleKg: true, titleRu: true } },
          company: { select: { id: true, name: true, logo: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      graduates = JSON.parse(JSON.stringify(db));
    }
  } catch (err) {
    console.warn('[graduates] DB unavailable:', (err as Error).message);
  }
  return { props: { graduates }, revalidate: 60 };
};
