import styles from './Loading.module.css';

interface Props {
  text?: string;
  fullPage?: boolean;
}

export default function Loading({ text, fullPage = false }: Props) {
  return (
    <div className={[styles.wrapper, fullPage ? styles.fullPage : ''].filter(Boolean).join(' ')}>
      <div className={styles.spinner} role="status" aria-label={text ?? 'Loading'}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
