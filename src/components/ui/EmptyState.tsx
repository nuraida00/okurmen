import Button from './Button';
import styles from './EmptyState.module.css';

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, actionLabel, onAction, actionHref, icon }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrap}>
        {icon ?? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      {(actionLabel && onAction) && (
        <Button variant="primary" size="md" onClick={onAction}>{actionLabel}</Button>
      )}
      {(actionLabel && actionHref) && (
        <Button as="a" href={actionHref} variant="primary" size="md">{actionLabel}</Button>
      )}
    </div>
  );
}
