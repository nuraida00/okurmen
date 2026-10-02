import SectionTitle from '@/components/ui/SectionTitle';
import { useLanguage } from '@/context/LanguageContext';
import styles from './FormatsSection.module.css';

export default function FormatsSection() {
  const { lang } = useLanguage();

  const formats = [
    {
      key: 'offline',
      icon: '🏛️',
      tag: lang === 'kg' ? 'Оффлайн' : 'Оффлайн',
      title: lang === 'kg' ? 'Оффлайн' : 'Оффлайн',
      desc: lang === 'kg'
        ? 'Аудиторияда жүздөн-жүзгө окутуу. Ментор менен түз байланыш жана командалык иш.'
        : 'Обучение лицом к лицу в аудитории. Прямой контакт с ментором и командная работа.',
      bullets: lang === 'kg'
        ? ['Жандуу байланыш', 'Ментор менен иш', 'Топто окуу']
        : ['Живое взаимодействие', 'Работа с ментором', 'Обучение в группе'],
    },
    {
      key: 'online',
      icon: '💻',
      tag: lang === 'kg' ? 'Онлайн' : 'Онлайн',
      title: lang === 'kg' ? 'Онлайн' : 'Онлайн',
      desc: lang === 'kg'
        ? 'Каалаган жерден окуу мүмкүнчүлүгү. Видео сабактар жана онлайн колдоо.'
        : 'Учись из любого места. Видеоуроки и онлайн поддержка в удобное время.',
      bullets: lang === 'kg'
        ? ['Каалаган жерден', 'Жеткиликтүү баа', 'Жеке темп']
        : ['Из любого места', 'Доступная цена', 'Свой темп'],
    },
    {
      key: 'hybrid',
      icon: '🔀',
      tag: lang === 'kg' ? 'Гибрид' : 'Гибрид',
      title: lang === 'kg' ? 'Гибрид' : 'Гибрид',
      desc: lang === 'kg'
        ? 'Эки форматтын артыкчылыктарын бириктирет. Максималдуу натыйжалуулук.'
        : 'Сочетает преимущества обоих форматов. Максимальная эффективность обучения.',
      bullets: lang === 'kg'
        ? ['Эки форматтын артыкчылыгы', 'Ийкемдүү расписание', 'Толук колдоо']
        : ['Лучшее из двух форматов', 'Гибкое расписание', 'Полная поддержка'],
    },
  ];

  return (
    <section className={styles.section} id="formats">
      <div className={styles.bg} aria-hidden />
      <div className="container">
        <SectionTitle
          tag={lang === 'kg' ? 'Форматтар' : 'Форматы'}
          title={lang === 'kg' ? 'ОКУУ ФОРМАТТАРЫ' : 'ФОРМАТЫ ОБУЧЕНИЯ'}
          subtitle={lang === 'kg'
            ? 'Сага ылайыктуу форматты тандап ал'
            : 'Выбери формат, который подходит именно тебе'}
          white
        />

        <div className={styles.grid}>
          {formats.map(f => (
            <div key={f.key} className={[styles.card, styles[f.key as 'offline' | 'online' | 'hybrid']].join(' ')}>
              <div className={styles.iconWrap} aria-hidden>{f.icon}</div>
              <div className={styles.formatTag}>{f.tag}</div>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.desc}>{f.desc}</p>
              <ul className={styles.bullets} aria-label={`${f.title} features`}>
                {f.bullets.map(b => (
                  <li key={b} className={styles.bullet}>
                    <span className={styles.bulletDot} aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
