import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTable, { StatusBadge, type Column } from '@/components/admin/AdminTable';
import { useAdmin } from '@/context/AdminContext';
import type { Booking } from '@/types';
import pageStyles from '../crud.module.css';

export default function AdminBookingsPage() {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { if (!loading && !admin) router.replace('/admin/login'); }, [admin, loading, router]);

  const load = useCallback(() => {
    const url = filter ? `/api/bookings?status=${filter}` : '/api/bookings';
    fetch(url)
      .then(r => r.json())
      .then(d => { if (d.success) setBookings(d.data?.items ?? []); })
      .catch(console.error);
  }, [filter]);

  useEffect(() => { if (admin) load(); }, [admin, load, filter]);

  const handleStatus = async (b: Booking, status: string) => {
    await fetch(`/api/bookings/${b.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const columns: Column<Booking>[] = [
    { key: 'id',        header: 'ID', width: '100px', render: b => b.id.slice(0, 8) + '...' },
    { key: 'firstName', header: 'Аты-жөнү', render: b => `${b.firstName} ${b.lastName}` },
    { key: 'phone',     header: 'Телефон' },
    { key: 'course',    header: 'Курс', render: b => b.course?.titleKg ?? '—' },
    { key: 'format',    header: 'Формат' },
    { key: 'participants', header: 'Кишилер' },
    { key: 'status',    header: 'Статус', render: b => <StatusBadge status={b.status} /> },
    { key: 'createdAt', header: 'Дата', render: b => new Date(b.createdAt).toLocaleDateString('ru-RU') },
  ];

  if (loading || !admin) return null;

  return (
    <AdminLayout title="Броньдор">
      <div className={pageStyles.page}>
        <div className={pageStyles.toolbar}>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className={pageStyles.search}
            style={{ maxWidth: 200 }}
          >
            <option value="">Баардыгы</option>
            <option value="PENDING">Жаңы</option>
            <option value="CONFIRMED">Ырасталган</option>
            <option value="PAID">Төлөнгөн</option>
            <option value="CANCELLED">Жокко чыгарылган</option>
          </select>
        </div>
        <AdminTable
          columns={columns}
          data={bookings}
        />
      </div>
    </AdminLayout>
  );
}
