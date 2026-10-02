import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAdmin } from '@/context/AdminContext';
import Button from '@/components/ui/Button';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const { login, admin } = useAdmin();
  const router = useRouter();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (admin) router.replace('/admin');
  }, [admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Бардык талааларды толтуруңуз'); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.ok) {
      router.replace('/admin');
    } else {
      setError(result.error ?? 'Ката кетти');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Кирүү — OKURMEN Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className={styles.page}>
        <div className={styles.card}>
          {/* Logo */}
          <div className={styles.logoWrap}>
            <div className={styles.logoIcon}>📚</div>
            <h1 className={styles.logoText}>OKURMEN</h1>
            <p className={styles.logoSub}>Башкаруу Панели</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email / Колдонуучу аты</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className={styles.input}
                autoComplete="username"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Сырсөз</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className={styles.input}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Кирүү
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
