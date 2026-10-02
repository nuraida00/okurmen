import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTable, { StatusBadge, type Column } from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import Button from '@/components/ui/Button';
import { useAdmin } from '@/context/AdminContext';
import type { TeamMember } from '@/types';
import formStyles from '@/components/admin/AdminForm.module.css';
import pageStyles from '../crud.module.css';

const EMPTY: Partial<TeamMember> = {
  nameKg: '', nameRu: '', positionKg: '', positionRu: '',
  descriptionKg: '', descriptionRu: '', experience: '',
  photo: '', instagram: '', telegram: '', whatsapp: '',
  sortOrder: 0, isPublished: true,
};

export default function AdminTeamPage() {
  const { admin, loading } = useAdmin();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');

  useEffect(() => { if (!loading && !admin) router.replace('/admin/login'); }, [admin, loading, router]);

  const load = useCallback(() => {
    fetch('/api/team?published=false')
      .then(r => r.json())
      .then(d => { if (d.success) setMembers(d.data); })
      .catch(console.error);
  }, []);

  useEffect(() => { if (admin) load(); }, [admin, load]);

  const openAdd  = () => { setEditing({ ...EMPTY }); setModalOpen(true); };
  const openEdit = (m: TeamMember) => { setEditing({ ...m }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!editing?.nameKg || !editing?.nameRu) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url    = isNew ? '/api/team' : `/api/team/${editing.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (res.ok) { load(); closeModal(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (m: TeamMember) => {
    if (!confirm(`"${m.nameKg}" кызматкерин жок кылуу?`)) return;
    await fetch(`/api/team/${m.id}`, { method: 'DELETE' });
    load();
  };

  const handlePublish = async (m: TeamMember) => {
    await fetch(`/api/team/${m.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !m.isPublished }),
    });
    load();
  };

  const filtered = members.filter(m =>
    m.nameKg.toLowerCase().includes(search.toLowerCase()) ||
    m.nameRu.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<TeamMember>[] = [
    { key: 'photo', header: '', width: '52px', render: m => (
      <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: 'var(--gradient-brand)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
        {m.photo
          ? <Image src={m.photo} alt={m.nameKg} fill style={{ objectFit: 'cover' }} />
          : m.nameKg.charAt(0)
        }
      </div>
    )},
    { key: 'nameKg',     header: 'Аты-жөнү (KG)', render: m => <strong>{m.nameKg}</strong> },
    { key: 'nameRu',     header: 'ФИО (RU)' },
    { key: 'positionKg', header: 'Кызматы (KG)' },
    { key: 'experience', header: 'Тажрыйба', render: m => m.experience ?? '—' },
    { key: 'isPublished', header: 'Статус', render: m => <StatusBadge status={String(m.isPublished)} /> },
  ];

  if (loading || !admin) return null;

  return (
    <AdminLayout title="Команда">
      <div className={pageStyles.page}>
        <div className={pageStyles.toolbar}>
          <input
            type="search"
            placeholder="Издөө..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={pageStyles.search}
          />
          <Button variant="primary" size="md" onClick={openAdd}>+ Кызматкер кошуу</Button>
        </div>

        <AdminTable
          columns={columns}
          data={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
          publishLabel={m => m.isPublished ? 'Жашыруу' : 'Жарыялоо'}
        />
      </div>

      <AdminModal
        title={editing?.id ? 'Кызматкерди өзгөртүү' : 'Жаңы кызматкер кошуу'}
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        loading={saving}
      >
        {editing && (
          <div className={formStyles.form}>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={`${formStyles.label} ${formStyles.required}`}>Аты-жөнү (KG)</label>
                <input className={formStyles.input} value={editing.nameKg ?? ''} onChange={e => setEditing(p => ({...p!, nameKg: e.target.value}))} />
              </div>
              <div className={formStyles.field}>
                <label className={`${formStyles.label} ${formStyles.required}`}>ФИО (RU)</label>
                <input className={formStyles.input} value={editing.nameRu ?? ''} onChange={e => setEditing(p => ({...p!, nameRu: e.target.value}))} />
              </div>
            </div>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={`${formStyles.label} ${formStyles.required}`}>Кызматы (KG)</label>
                <input className={formStyles.input} value={editing.positionKg ?? ''} onChange={e => setEditing(p => ({...p!, positionKg: e.target.value}))} />
              </div>
              <div className={formStyles.field}>
                <label className={`${formStyles.label} ${formStyles.required}`}>Должность (RU)</label>
                <input className={formStyles.input} value={editing.positionRu ?? ''} onChange={e => setEditing(p => ({...p!, positionRu: e.target.value}))} />
              </div>
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Сүрөттөмө (KG)</label>
              <textarea className={formStyles.textarea} value={editing.descriptionKg ?? ''} onChange={e => setEditing(p => ({...p!, descriptionKg: e.target.value}))} rows={3} />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Описание (RU)</label>
              <textarea className={formStyles.textarea} value={editing.descriptionRu ?? ''} onChange={e => setEditing(p => ({...p!, descriptionRu: e.target.value}))} rows={3} />
            </div>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Тажрыйба</label>
                <input className={formStyles.input} value={editing.experience ?? ''} onChange={e => setEditing(p => ({...p!, experience: e.target.value}))} placeholder="мис: 1 жыл 1 ай" />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Сүрөт URL</label>
                <input className={formStyles.input} value={editing.photo ?? ''} onChange={e => setEditing(p => ({...p!, photo: e.target.value}))} placeholder="/images/okurmen/team/..." />
              </div>
            </div>
            <hr className={formStyles.separator} />
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Instagram</label>
                <input className={formStyles.input} value={editing.instagram ?? ''} onChange={e => setEditing(p => ({...p!, instagram: e.target.value}))} placeholder="https://instagram.com/..." />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Telegram</label>
                <input className={formStyles.input} value={editing.telegram ?? ''} onChange={e => setEditing(p => ({...p!, telegram: e.target.value}))} placeholder="https://t.me/..." />
              </div>
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>WhatsApp</label>
              <input className={formStyles.input} value={editing.whatsapp ?? ''} onChange={e => setEditing(p => ({...p!, whatsapp: e.target.value}))} placeholder="https://wa.me/..." />
            </div>
            <label className={formStyles.checkRow}>
              <input type="checkbox" checked={editing.isPublished ?? true} onChange={e => setEditing(p => ({...p!, isPublished: e.target.checked}))} />
              <span className={formStyles.label}>Жарыялоо</span>
            </label>
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
}
