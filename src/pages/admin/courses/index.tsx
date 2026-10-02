import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTable, { StatusBadge, type Column } from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import Button from '@/components/ui/Button';
import { useAdmin } from '@/context/AdminContext';
import type { Course } from '@/types';
import formStyles from '@/components/admin/AdminForm.module.css';
import pageStyles from '../crud.module.css';

const EMPTY: Partial<Course> & Record<string, unknown> = {
  titleKg: '', titleRu: '', descriptionKg: '', descriptionRu: '',
  shortDescKg: '', shortDescRu: '', price: undefined, currency: 'KGS',
  duration: '', format: 'OFFLINE', level: 'BEGINNER',
  totalSeats: undefined, availableSeats: undefined,
  image: '', requirementsKg: '', requirementsRu: '',
  isPublished: false, sortOrder: 0,
};

export default function AdminCoursesPage() {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Partial<Course> | null>(null);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');

  useEffect(() => { if (!loading && !admin) router.replace('/admin/login'); }, [admin, loading, router]);

  const load = useCallback(() => {
    fetch('/api/courses?published=false')
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data); })
      .catch(console.error);
  }, []);

  useEffect(() => { if (admin) load(); }, [admin, load]);

  const openAdd  = () => { setEditing({ ...EMPTY }); setModalOpen(true); };
  const openEdit = (c: Course) => { setEditing({ ...c }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!editing?.titleKg || !editing?.titleRu) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url   = isNew ? '/api/courses' : `/api/courses/${editing.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (res.ok) { load(); closeModal(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (c: Course) => {
    if (!confirm(`"${c.titleKg}" курсун жок кылуу?`)) return;
    await fetch(`/api/courses/${c.id}`, { method: 'DELETE' });
    load();
  };

  const handlePublish = async (c: Course) => {
    await fetch(`/api/courses/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !c.isPublished }),
    });
    load();
  };

  const filtered = courses.filter(c =>
    c.titleKg.toLowerCase().includes(search.toLowerCase()) ||
    c.titleRu.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Course>[] = [
    { key: 'image', header: '', width: '48px', render: c => (
      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📚</div>
    )},
    { key: 'titleKg',  header: 'Аталышы (KG)', render: c => <strong>{c.titleKg}</strong> },
    { key: 'titleRu',  header: 'Название (RU)' },
    { key: 'price',    header: 'Баасы', render: c => c.price ? `${Number(c.price).toLocaleString()} ${c.currency}` : '—' },
    { key: 'duration', header: 'Узактыгы', render: c => c.duration ?? '—' },
    { key: 'format',   header: 'Формат' },
    { key: 'isPublished', header: 'Статус', render: c => <StatusBadge status={String(c.isPublished)} /> },
  ];

  if (loading || !admin) return null;

  return (
    <AdminLayout title="Курстар">
      <div className={pageStyles.page}>
        <div className={pageStyles.toolbar}>
          <input
            type="search"
            placeholder="Издөө..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={pageStyles.search}
          />
          <Button variant="primary" size="md" onClick={openAdd}>+ Курс кошуу</Button>
        </div>

        <AdminTable
          columns={columns}
          data={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
          publishLabel={c => c.isPublished ? 'Жашыруу' : 'Жарыялоо'}
        />
      </div>

      <AdminModal
        title={editing?.id ? 'Курсту өзгөртүү' : 'Жаңы курс кошуу'}
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        loading={saving}
      >
        {editing && (
          <div className={formStyles.form}>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={`${formStyles.label} ${formStyles.required}`}>Аталышы (KG)</label>
                <input className={formStyles.input} value={editing.titleKg ?? ''} onChange={e => setEditing(p => ({...p!, titleKg: e.target.value}))} />
              </div>
              <div className={formStyles.field}>
                <label className={`${formStyles.label} ${formStyles.required}`}>Название (RU)</label>
                <input className={formStyles.input} value={editing.titleRu ?? ''} onChange={e => setEditing(p => ({...p!, titleRu: e.target.value}))} />
              </div>
            </div>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Кыскача сүрөттөмө (KG)</label>
                <input className={formStyles.input} value={editing.shortDescKg ?? ''} onChange={e => setEditing(p => ({...p!, shortDescKg: e.target.value}))} />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Краткое описание (RU)</label>
                <input className={formStyles.input} value={editing.shortDescRu ?? ''} onChange={e => setEditing(p => ({...p!, shortDescRu: e.target.value}))} />
              </div>
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Толук сүрөттөмө (KG)</label>
              <textarea className={formStyles.textarea} value={editing.descriptionKg ?? ''} onChange={e => setEditing(p => ({...p!, descriptionKg: e.target.value}))} rows={3} />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Описание (RU)</label>
              <textarea className={formStyles.textarea} value={editing.descriptionRu ?? ''} onChange={e => setEditing(p => ({...p!, descriptionRu: e.target.value}))} rows={3} />
            </div>
            <hr className={formStyles.separator} />
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Баасы</label>
                <input type="number" className={formStyles.input} value={editing.price ?? ''} onChange={e => setEditing(p => ({...p!, price: e.target.value ? Number(e.target.value) : undefined}))} />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Валюта</label>
                <select className={formStyles.select} value={editing.currency ?? 'KGS'} onChange={e => setEditing(p => ({...p!, currency: e.target.value}))}>
                  <option value="KGS">KGS</option>
                  <option value="USD">USD</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
            </div>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Узактыгы</label>
                <input className={formStyles.input} value={editing.duration ?? ''} onChange={e => setEditing(p => ({...p!, duration: e.target.value}))} placeholder="мис: 3 ай" />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Формат</label>
                <select className={formStyles.select} value={editing.format ?? 'OFFLINE'} onChange={e => setEditing(p => ({...p!, format: e.target.value as Course['format']}))}>
                  <option value="OFFLINE">Оффлайн</option>
                  <option value="ONLINE">Онлайн</option>
                  <option value="HYBRID">Гибрид</option>
                </select>
              </div>
            </div>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Жалпы орундар</label>
                <input type="number" className={formStyles.input} value={editing.totalSeats ?? ''} onChange={e => setEditing(p => ({...p!, totalSeats: e.target.value ? Number(e.target.value) : undefined}))} />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Бош орундар</label>
                <input type="number" className={formStyles.input} value={editing.availableSeats ?? ''} onChange={e => setEditing(p => ({...p!, availableSeats: e.target.value ? Number(e.target.value) : undefined}))} />
              </div>
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Сүрөт URL</label>
              <input className={formStyles.input} value={editing.image ?? ''} onChange={e => setEditing(p => ({...p!, image: e.target.value}))} placeholder="/images/okurmen/courses/..." />
            </div>
            <label className={formStyles.checkRow}>
              <input type="checkbox" checked={editing.isPublished ?? false} onChange={e => setEditing(p => ({...p!, isPublished: e.target.checked}))} />
              <span className={formStyles.label}>Жарыялоо</span>
            </label>
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
}
