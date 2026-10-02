import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdmin } from '@/context/AdminContext';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { section: 'Башкы' },
  { href: '/admin',           icon: '📊', label: 'Dashboard' },
  { section: 'Контент' },
  { href: '/admin/courses',   icon: '📚', label: 'Курстар' },
  { href: '/admin/team',      icon: '👥', label: 'Команда' },
  { href: '/admin/students',  icon: '🎓', label: 'Студенттер' },
  { href: '/admin/graduates', icon: '🏆', label: 'Бүтүрүүчүлөр' },
  { href: '/admin/reviews',   icon: '⭐', label: 'Пикирлер' },
  { section: 'Броньдор' },
  { href: '/admin/bookings',  icon: '📅', label: 'Броньдор' },
  { href: '/admin/payments',  icon: '💰', label: 'Төлөмдөр' },
  { section: 'Медиа' },
  { href: '/admin/gallery',   icon: '🖼️', label: 'Галерея' },
  { section: 'Жөндөөлөр' },
  { href: '/admin/settings',  icon: '⚙️', label: 'Жөндөөлөр' },
];

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  const { admin, logout } = useAdmin();
  const router = useRouter();
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => { setSideOpen(false); }, [router.pathname]);

  const isActive = (href: string) =>
    href === '/admin' ? router.pathname === '/admin' : router.pathname.startsWith(href);

  const pageTitle = title ? `${title} — OKURMEN Admin` : 'OKURMEN Admin';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className={styles.shell}>
        {/* Sidebar */}
        <aside className={[styles.sidebar, sideOpen ? styles.open : ''].join(' ')}>
          <div className={styles.sidebarLogo}>
            <div>
              <div className={styles.logoText}>OKURMEN</div>
            </div>
            <span className={styles.logoBadge}>Admin</span>
          </div>

          <nav className={styles.nav}>
            {NAV_ITEMS.map((item, i) => {
              if ('section' in item) {
                return <div key={i} className={styles.navSection}>{item.section}</div>;
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[styles.navItem, isActive(item.href) ? styles.active : ''].join(' ')}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarBottom}>
            <button className={styles.logoutBtn} onClick={logout}>
              <span>🚪</span>
              Чыгуу
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sideOpen && (
          <div
            className={[styles.overlay, styles.visible].join(' ')}
            onClick={() => setSideOpen(false)}
          />
        )}

        {/* Main */}
        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button className={styles.menuBtn} onClick={() => setSideOpen(true)} aria-label="Меню">☰</button>
              <h1 className={styles.topbarTitle}>{title ?? 'Dashboard'}</h1>
            </div>
            <div className={styles.topbarRight}>
              {admin && (
                <div className={styles.adminBadge}>
                  <div className={styles.adminAvatar}>
                    {admin.name?.charAt(0) ?? 'A'}
                  </div>
                  {admin.name || admin.email}
                </div>
              )}
            </div>
          </header>

          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
