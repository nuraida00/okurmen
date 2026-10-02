import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CtaSection.module.css';

export default function CtaSection() {
  const { lang } = useLanguage();

  return (
    <section className={styles.section} aria-label="Call to action">
      <div className={styles.blob + ' ' + styles.blob1} aria-hidden />
      <div className={styles.blob + ' ' + styles.blob2} aria-hidden />

      <div className="container">
        <div className={styles.inner}>
          <div className={styles.badge}>
            <span>✨</span>
            OKURMEN
          </div>

          <h2 className={styles.title}>
            {lang === 'kg'
              ? 'Болочогуңду азыр куруп баштачу!'
              : 'Начни строить своё будущее прямо сейчас!'}
          </h2>

          <p className={styles.subtitle}>
            {lang === 'kg'
              ? 'Заманбап курстарыбызга жазылып, жаңы мүмкүнчүлүктөргө жол ач.'
              : 'Запишись на наши курсы и открой новые возможности для карьеры.'}
          </p>

          <div className={styles.buttons}>
            <Button as="a" href="/courses" variant="outlineWhite" size="lg">
              {lang === 'kg' ? 'Курстарды көрүү' : 'Смотреть курсы'}
            </Button>
            <Button
              as="a"
              href="/contact"
              size="lg"
              style={{ background: 'var(--color-white)', color: 'var(--color-pink)', borderColor: 'var(--color-white)' }}
            >
              {lang === 'kg' ? 'Байланышуу' : 'Связаться с нами'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
