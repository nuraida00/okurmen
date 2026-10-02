import Layout from '@/components/layout/Layout';
import SectionTitle from '@/components/ui/SectionTitle';
import { useLanguage } from '@/context/LanguageContext';
import styles from './about.module.css';

export default function AboutPage() {
  const { t, lang } = useLanguage();

  const values = lang === 'kg'
    ? ['Практикалык билим', 'Ачык-айкындуулук', 'Инновация', 'Колдоо', 'Сапат', 'Өнүгүү']
    : ['Практические знания', 'Прозрачность', 'Инновации', 'Поддержка', 'Качество', 'Развитие'];

  return (
    <Layout title={t.nav.about}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.badge}>OKURMEN</span>
            <h1 className={styles.title}>
              {lang === 'kg' ? 'БИЗ ЖӨНҮНДӨ' : 'О НАС'}
            </h1>
            <p className={styles.subtitle}>
              {lang === 'kg'
                ? 'Заманбап билим берүү борбору — болочок үчүн билим'
                : 'Современный образовательный центр — знания для будущего'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div>
              <SectionTitle
                tag={lang === 'kg' ? 'Максат' : 'Миссия'}
                title={t.about.mission}
                align="left"
              />
              <p className={styles.text}>
                {lang === 'kg'
                  ? 'Биздин миссиябыз — ар бир студентке жогорку сапаттагы практикалык билим берип, аларды кесиптик жактан өстүрүп, реалдуу мүмкүнчүлүктөргө жол ачуу.'
                  : 'Наша миссия — обеспечить каждому студенту качественное практическое образование, помочь им вырасти профессионально и открыть реальные возможности.'}
              </p>
              <p className={styles.text} style={{ marginTop: '1rem' }}>
                {lang === 'kg'
                  ? 'OKURMEN — бул жөн гана окуу борбору эмес, бул болочокко инвестиция.'
                  : 'OKURMEN — это не просто учебный центр, это инвестиция в будущее.'}
              </p>
            </div>
            <div className={styles.missionVisual}>
              <div className={styles.missionCard}>
                <div className={styles.missionIcon}>🎯</div>
                <div className={styles.missionText}>
                  {lang === 'kg' ? 'Практикалык билим' : 'Практические знания'}
                </div>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionIcon}>🚀</div>
                <div className={styles.missionText}>
                  {lang === 'kg' ? 'Кесиптик өсүү' : 'Профессиональный рост'}
                </div>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionIcon}>💡</div>
                <div className={styles.missionText}>
                  {lang === 'kg' ? 'Инновация' : 'Инновации'}
                </div>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionIcon}>🤝</div>
                <div className={styles.missionText}>
                  {lang === 'kg' ? 'Колдоо' : 'Поддержка'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={[styles.section, styles.sectionLight].join(' ')}>
        <div className="container">
          <SectionTitle
            tag={lang === 'kg' ? 'Баалуулуктар' : 'Ценности'}
            title={t.about.values}
          />
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={i} className={styles.valueItem}>
                <div className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.valueName}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
