import Button from './Button';
import styles from './EmptyState.module.css';

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = 'Ката кетти', description, onRetry }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrap} style={{ color: 'var(--color-pink)', background: 'rgba(229,0,135,0.08)' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>Кайра аракет</Button>
      )}
    </div>
  );
}
