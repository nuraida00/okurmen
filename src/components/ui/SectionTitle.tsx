import styles from './SectionTitle.module.css';

interface Props {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  white?: boolean;
  showLine?: boolean;
  className?: string;
}

export default function SectionTitle({
  tag,
  title,
  subtitle,
  align = 'center',
  white = false,
  showLine = true,
  className = '',
}: Props) {
  return (
    <div
      className={[
        styles.wrapper,
        styles[align],
        className,
      ].filter(Boolean).join(' ')}
    >
      {tag && <span className={styles.tag}>{tag}</span>}
      <h2 className={[styles.title, white ? styles.titleWhite : ''].filter(Boolean).join(' ')}>
        {title}
      </h2>
      {showLine && <div className={styles.line} />}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
