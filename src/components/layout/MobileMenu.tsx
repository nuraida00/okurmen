import Link from 'next/link';
import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import styles from './MobileMenu.module.css';

interface NavItem {
  href: string;
  label: string;
}

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeHref: string;
}

export default function MobileMenu({ id, isOpen, onClose, navItems, activeHref }: Props) {
  const { t } = useLanguage();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) =>
    href === '/' ? activeHref === '/' : activeHref.startsWith(href);

  return (
    <div
      id={id}
      className={[styles.overlay, isOpen ? styles.open : ''].filter(Boolean).join(' ')}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Навигация"
    >
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden />

      {/* Drawer */}
      <div className={styles.drawer}>
        <div className={styles.drawerHead}>
          <Link href="/" className={styles.drawerLogo} onClick={onClose}>
            OKURMEN
          </Link>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Менюну жабуу"
          >
            ✕
          </button>
        </div>

        <nav className={styles.nav} aria-label="Mobile navigation">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                styles.navLink,
                isActive(item.href) ? styles.navLinkActive : '',
              ].filter(Boolean).join(' ')}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.bottom}>
          <LanguageSwitcher theme="light" />
          <Link href="/courses" className={styles.bookBtn} onClick={onClose}>
            {t.nav.bookCourse}
          </Link>
        </div>
      </div>
    </div>
  );
}
