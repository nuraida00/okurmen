import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from './AdminModal.module.css';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export default function AdminModal({ title, isOpen, onClose, onSave, saveLabel = 'Сактоо', loading, children }: Props) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal aria-label={title}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Жабуу">✕</button>
        </div>
        <div className={styles.body}>{children}</div>
        {onSave && (
          <div className={styles.footer}>
            <Button variant="ghost" size="md" onClick={onClose}>Жокко чыгаруу</Button>
            <Button variant="primary" size="md" onClick={onSave} loading={loading}>{saveLabel}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
