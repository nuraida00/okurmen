import { useLanguage } from '@/context/LanguageContext';
import styles from './LanguageSwitcher.module.css';

interface Props {
  theme?: 'light' | 'dark'; // light = white text on dark bg, dark = dark text on light bg
}

export default function LanguageSwitcher({ theme = 'light' }: Props) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={[styles.switcher, theme === 'dark' ? styles.dark : ''].filter(Boolean).join(' ')}
      role="group"
      aria-label="Language selector"
    >
      <button
        className={[styles.btn, lang === 'kg' ? styles.active : ''].filter(Boolean).join(' ')}
        onClick={() => setLang('kg')}
        aria-pressed={lang === 'kg'}
        aria-label="Кыргызча"
      >
        KG
      </button>
      <button
        className={[styles.btn, lang === 'ru' ? styles.active : ''].filter(Boolean).join(' ')}
        onClick={() => setLang('ru')}
        aria-pressed={lang === 'ru'}
        aria-label="Русский"
      >
        RU
      </button>
    </div>
  );
}
