import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';

export default function AdminPaymentsPage() {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  useEffect(() => { if (!loading && !admin) router.replace('/admin/login'); }, [admin, loading, router]);
  if (loading || !admin) return null;
  return (
    <AdminLayout title="Төлөмдөр">
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '0.5rem' }}>Төлөмдөр</h2>
        <p>Payment provider туташтырылгандан кийин активдешет</p>
      </div>
    </AdminLayout>
  );
}
