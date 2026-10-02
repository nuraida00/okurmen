import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSettingsPage() {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  useEffect(() => { if (!loading && !admin) router.replace('/admin/login'); }, [admin, loading, router]);
  if (loading || !admin) return null;
  return (
    <AdminLayout title="Жөндөөлөр">
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '0.5rem' }}>Жөндөөлөр</h2>
        <p>Маалымат жакында кошулат</p>
      </div>
    </AdminLayout>
  );
}
