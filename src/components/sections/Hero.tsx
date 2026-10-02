import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

export default function Hero() {
  const { t, lang } = useLanguage();

  const statsKg = [
    { num: '—', label: 'Курс' },
    { num: '—', label: 'Студент' },
    { num: '—', label: 'Жыл тажрыйба' },
  ];
  const statsRu = [
    { num: '—', label: 'Курсов' },
    { num: '—', label: 'Студентов' },
    { num: '—', label: 'Года опыта' },
  ];
  const stats = lang === 'kg' ? statsKg : statsRu;

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Background decorations */}
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />
      <div className={styles.blob3} aria-hidden />
      <div className={styles.gridOverlay} aria-hidden />

      <div className={`container ${styles.inner}`}>
        {/* Left: text */}
        <div className={styles.text}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden />
            OKURMEN — ОКУУ БОРБОРУ
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleAccent}>
              {lang === 'kg' ? 'БИЛИМ — ' : 'ЗНАНИЯ — '}
            </span>
            {lang === 'kg' ? 'БУЛ МҮМКҮНЧҮЛҮК' : 'ЭТО ВОЗМОЖНОСТИ'}
          </h1>

          <p className={styles.subtitle}>{t.hero.subtitle}</p>
          <p className={styles.description}>{t.hero.description}</p>

          <div className={styles.buttons}>
            <Button as="a" href="/courses" variant="orange" size="lg">
              {t.hero.btnCourses}
            </Button>
            <Button as="a" href="/courses" variant="outlineWhite" size="lg">
              {t.hero.btnBook}
            </Button>
          </div>

          {/* Stats */}
          <div className={styles.stats} aria-label="Статистика">
            {stats.map(s => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: visual card */}
        <div className={styles.visual} aria-hidden>
          <div className={styles.visualCard}>
            <div className={styles.visualBg} />
            <div className={styles.visualContent}>
              <div className={styles.visualIcon}>📚</div>
              <div className={styles.visualTitle}>OKURMEN</div>
              <div className={styles.visualSub}>
                {lang === 'kg' ? 'Заманбап билим берүү' : 'Современное образование'}
              </div>

              {/* Floating badges */}
              <div className={styles.floatBadge} style={{ top: 32, right: -20 }}>
                <div className={styles.floatIcon} style={{ background: 'rgba(255,121,0,0.12)' }}>🎯</div>
                <span>{lang === 'kg' ? 'Практика' : 'Практика'}</span>
              </div>
              <div className={styles.floatBadge} style={{ bottom: 80, left: -30 }}>
                <div className={styles.floatIcon} style={{ background: 'rgba(23,59,130,0.12)' }}>🚀</div>
                <span>{lang === 'kg' ? 'Карьера' : 'Карьера'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint} aria-hidden>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>scroll</span>
      </div>
    </section>
  );
}
