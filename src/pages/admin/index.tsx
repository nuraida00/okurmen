import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import styles from './dashboard.module.css';

interface Stats {
  totalCourses:    number;
  totalTeam:       number;
  totalStudents:   number;
  totalGraduates:  number;
  totalBookings:   number;
  pendingBookings: number;
  paidBookings:    number;
  totalReviews:    number;
}

export default function AdminDashboard() {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !admin) router.replace('/admin/login');
  }, [admin, loading, router]);

  useEffect(() => {
    if (!admin) return;
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, [admin]);

  if (loading || !admin) return null;

  const statCards = [
    { icon: '📚', label: 'Курстар',       value: stats?.totalCourses    ?? '—', color: 'var(--color-primary)', href: '/admin/courses' },
    { icon: '👥', label: 'Команда',       value: stats?.totalTeam       ?? '—', color: 'var(--color-orange)',  href: '/admin/team' },
    { icon: '🎓', label: 'Студенттер',    value: stats?.totalStudents   ?? '—', color: 'var(--color-pink)',    href: '/admin/students' },
    { icon: '🏆', label: 'Бүтүрүүчүлөр', value: stats?.totalGraduates  ?? '—', color: '#059669',              href: '/admin/graduates' },
    { icon: '📅', label: 'Броньдор',      value: stats?.totalBookings   ?? '—', color: '#7C3AED',              href: '/admin/bookings' },
    { icon: '⏳', label: 'Жаңы арыздар', value: stats?.pendingBookings ?? '—', color: '#D97706',              href: '/admin/bookings' },
    { icon: '✅', label: 'Төлөнгөн',     value: stats?.paidBookings    ?? '—', color: '#059669',              href: '/admin/payments' },
    { icon: '⭐', label: 'Пикирлер',      value: stats?.totalReviews    ?? '—', color: '#DB2777',              href: '/admin/reviews' },
  ];

  const quickLinks = [
    { href: '/admin/courses',  icon: '📚', label: 'Курс кошуу',               desc: 'Жаңы курс кошуу же редактирлөө' },
    { href: '/admin/team',     icon: '👥', label: 'Кызматкер кошуу',          desc: 'Команда мүчөсүн кошуу' },
    { href: '/admin/bookings', icon: '📅', label: 'Броньдорду кароо',         desc: 'Жаңы арыздарды иштеп чыгуу' },
    { href: '/admin/reviews',  icon: '⭐', label: 'Пикирлерди модерациялоо',  desc: 'Жарыялоо же жашыруу' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className={styles.page}>
        <p className={styles.welcome}>
          Кош келдиңиз, <strong>{admin.name ?? admin.email}</strong>! 👋
        </p>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {statCards.map(c => (
            <Link key={c.label} href={c.href} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${c.color}18`, color: c.color }}>
                {c.icon}
              </div>
              <div>
                <div className={styles.statValue}>
                  {statsLoading ? <span className={styles.skeleton} /> : c.value}
                </div>
                <div className={styles.statLabel}>{c.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <h2 className={styles.sectionTitle}>Тез аракеттер</h2>
        <div className={styles.quickGrid}>
          {quickLinks.map(l => (
            <Link key={l.href} href={l.href} className={styles.quickCard}>
              <div className={styles.quickIcon}>{l.icon}</div>
              <div>
                <div className={styles.quickLabel}>{l.label}</div>
                <div className={styles.quickDesc}>{l.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Help */}
        <div className={styles.helpCard}>
          <div className={styles.helpIcon}>💡</div>
          <div>
            <div className={styles.helpTitle}>Баштоо үчүн</div>
            <div className={styles.helpText}>
              1. DATABASE_URL — <code>.env.local</code> файлына кошуу<br />
              2. <code>npx prisma db update</code> — схеманы БДга жөнөтүү<br />
              3. <code>npm run db:seed</code> — башталгыч маалыматтарды жүктөө<br />
              4. Курстарды жана командани кошуу
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
