import SectionTitle from '@/components/ui/SectionTitle';
import { useLanguage } from '@/context/LanguageContext';
import type { Feature } from '@/types';
import styles from './WhyUs.module.css';

// Default features shown when DB is empty — no real data invented
const defaultFeaturesKg = [
  { icon: '🎯', titleKg: 'Практикалык билим',    titleRu: 'Практические знания',     descKg: 'Теория менен практиканы бириктирген окутуу форматы',         descRu: 'Формат обучения, сочетающий теорию и практику' },
  { icon: '👨‍🏫', titleKg: 'Күчтүү менторлор',      titleRu: 'Сильные менторы',          descKg: 'Тажрыйбалуу адистер жана менторлор тарабынан окутуу',        descRu: 'Обучение опытными специалистами и менторами' },
  { icon: '🏛️', titleKg: 'Заманбап аудитория',    titleRu: 'Современная аудитория',    descKg: 'Окуу үчүн ыңгайлуу заманбап чөйрө жана аудитория',          descRu: 'Современная среда и аудитория для комфортного обучения' },
  { icon: '🚀', titleKg: 'Реалдуу мүмкүнчүлүк',  titleRu: 'Реальные возможности',     descKg: 'Билим алгандан кийин реалдуу мүмкүнчүлүктөргө жол ачылат',  descRu: 'После обучения открываются реальные карьерные возможности' },
  { icon: '💡', titleKg: 'Өнүгүү жана колдоо',   titleRu: 'Развитие и поддержка',     descKg: 'Окутуу учурунда жана андан кийин толук колдоо',              descRu: 'Полная поддержка во время и после обучения' },
  { icon: '📈', titleKg: 'Кесиптик өсүү',        titleRu: 'Профессиональный рост',    descKg: 'Кесиптик жактан өсүп, карьераңды куруп ал',                  descRu: 'Расти профессионально и строй свою карьеру' },
];

interface Props {
  features?: Feature[];
}

export default function WhyUs({ features }: Props) {
  const { t, lang } = useLanguage();

  const items = features && features.length > 0
    ? features
    : defaultFeaturesKg;

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle
          tag={lang === 'kg' ? 'Артыкчылыктар' : 'Преимущества'}
          title={t.whyUs.sectionTitle}
          subtitle={t.whyUs.sectionSubtitle}
        />

        <div className={styles.grid}>
          {items.map((item, i) => {
            const icon   = 'icon' in item ? item.icon : '⭐';
            const title  = features
              ? (lang === 'kg' ? (item as Feature).titleKg : (item as Feature).titleRu)
              : (lang === 'kg' ? (item as typeof defaultFeaturesKg[0]).titleKg : (item as typeof defaultFeaturesKg[0]).titleRu);
            const desc   = features
              ? (lang === 'kg' ? (item as Feature).descKg : (item as Feature).descRu)
              : (lang === 'kg' ? (item as typeof defaultFeaturesKg[0]).descKg : (item as typeof defaultFeaturesKg[0]).descRu);

            return (
              <div
                key={'id' in item ? item.id : i}
                className={styles.card}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={styles.iconWrap} aria-hidden>{icon}</div>
                <h3 className={styles.title}>{title}</h3>
                {desc && <p className={styles.desc}>{desc}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
