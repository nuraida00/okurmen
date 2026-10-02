import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTable, { StatusBadge, type Column } from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import Button from '@/components/ui/Button';
import { useAdmin } from '@/context/AdminContext';
import type { Review } from '@/types';
import formStyles from '@/components/admin/AdminForm.module.css';
import pageStyles from '../crud.module.css';

export default function AdminReviewsPage() {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Review> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !admin) router.replace('/admin/login'); }, [admin, loading, router]);

  const load = useCallback(() => {
    fetch('/api/reviews?published=false', { headers: { Authorization: `Bearer ${typeof document !== 'undefined' ? document.cookie.split('okurmen_admin_token=')[1]?.split(';')[0] ?? '' : ''}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setReviews(d.data); })
      .catch(console.error);
  }, []);

  // For admin view, fetch all including unpublished
  useEffect(() => { if (admin) load(); }, [admin, load]);

  const handlePublish = async (r: Review) => {
    await fetch(`/api/reviews/${r.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !r.isPublished }),
    });
    load();
  };

  const handleDelete = async (r: Review) => {
    if (!confirm('Пикирди жок кылуу?')) return;
    await fetch(`/api/reviews/${r.id}`, { method: 'DELETE' });
    load();
  };

  const columns: Column<Review>[] = [
    { key: 'name',   header: 'Аты-жөнү' },
    { key: 'rating', header: 'Рейтинг', render: r => '★'.repeat(r.rating) },
    { key: 'textKg', header: 'Пикир (KG)', render: r => (r.textKg ?? '').slice(0, 60) + ((r.textKg?.length ?? 0) > 60 ? '...' : '') },
    { key: 'isPublished', header: 'Статус', render: r => <StatusBadge status={String(r.isPublished)} /> },
    { key: 'createdAt', header: 'Дата', render: r => new Date(r.createdAt).toLocaleDateString('ru-RU') },
  ];

  if (loading || !admin) return null;

  return (
    <AdminLayout title="Пикирлер">
      <div className={pageStyles.page}>
        <div className={pageStyles.toolbar}>
          <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
            Жалпы: {reviews.length} пикир
          </span>
        </div>
        <AdminTable
          columns={columns}
          data={reviews}
          onPublish={handlePublish}
          onDelete={handleDelete}
          publishLabel={r => r.isPublished ? 'Жашыруу' : 'Жарыялоо'}
        />
      </div>
    </AdminLayout>
  );
}
