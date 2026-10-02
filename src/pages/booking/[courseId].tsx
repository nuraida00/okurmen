import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import type { Course, CourseFormat } from '@/types';
import styles from './booking.module.css';

interface Props { course: Course | null; }

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  format: CourseFormat;
  groupName: string;
  participants: number;
  comment: string;
}

const INITIAL: FormData = {
  firstName: '', lastName: '', phone: '', email: '',
  format: 'OFFLINE', groupName: '', participants: 1, comment: '',
};

export default function BookingPage({ course }: Props) {
  const { t, lang } = useLanguage();
  const [form, setForm]   = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const courseTitle = course
    ? (lang === 'kg' ? course.titleKg : course.titleRu)
    : (lang === 'kg' ? 'Маалымат жок' : 'Курс не найден');

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = t.booking.required;
    if (!form.lastName.trim())  e.lastName  = t.booking.required;
    if (!form.phone.trim())     e.phone     = t.booking.required;
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = t.booking.invalidPhone;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.booking.invalidEmail;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'participants' ? Number(value) : value }));
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseId: course?.id }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setApiError(data.error ?? t.booking.error);
      }
    } catch {
      setApiError(t.booking.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t.booking.title}>
      <div className={styles.page}>
        <div className="container">
          <Link href={course ? `/courses/${course.id}` : '/courses'} className={styles.back}>
            ← {t.nav.courses}
          </Link>

          <div className={styles.grid}>
            {/* Course info */}
            <div className={styles.courseInfo}>
              <div className={styles.courseCard}>
                <div className={styles.courseIcon}>📚</div>
                <h2 className={styles.courseTitle}>{courseTitle}</h2>

                {course && (
                  <>
                    {course.duration && (
                      <div className={styles.infoRow}>
                        <span>⏱ {t.courses.duration}:</span>
                        <span>{course.duration}</span>
                      </div>
                    )}
                    <div className={styles.infoRow}>
                      <span>📍 {t.courses.format}:</span>
                      <span>{t.courses.formats[course.format]}</span>
                    </div>
                    {course.price && (
                      <div className={styles.infoRow}>
                        <span>💰 {t.courses.price}:</span>
                        <span className={styles.price}>
                          {Number(course.price).toLocaleString()} {course.currency}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {!course && (
                  <p className={styles.noCourseTip}>
                    {lang === 'kg'
                      ? 'Курс боюнча маалыматты менеджерибиз берет'
                      : 'Менеджер свяжется с вами по деталям курса'}
                  </p>
                )}
              </div>
            </div>

            {/* Form */}
            <div className={styles.formWrap}>
              <h1 className={styles.formTitle}>{t.booking.title}</h1>

              {success ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>✓</div>
                  <h3 className={styles.successTitle}>{t.booking.success}</h3>
                  <p className={styles.successText}>
                    {lang === 'kg'
                      ? 'Менеджерибиз жакында сиз менен байланышат'
                      : 'Наш менеджер свяжется с вами в ближайшее время'}
                  </p>
                  <Button as="a" href="/courses" variant="primary" size="md">
                    {t.nav.courses}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <div className={styles.row}>
                    <Field label={t.booking.firstName} error={errors.firstName}>
                      <input name="firstName" type="text" value={form.firstName} onChange={handleChange}
                        className={[styles.input, errors.firstName ? styles.inputError : ''].join(' ')}
                        autoComplete="given-name" required />
                    </Field>
                    <Field label={t.booking.lastName} error={errors.lastName}>
                      <input name="lastName" type="text" value={form.lastName} onChange={handleChange}
                        className={[styles.input, errors.lastName ? styles.inputError : ''].join(' ')}
                        autoComplete="family-name" required />
                    </Field>
                  </div>

                  <div className={styles.row}>
                    <Field label={t.booking.phone} error={errors.phone}>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                        className={[styles.input, errors.phone ? styles.inputError : ''].join(' ')}
                        placeholder="+996 ..." autoComplete="tel" required />
                    </Field>
                    <Field label={`${t.booking.email} (${lang === 'kg' ? 'милдеттүү эмес' : 'необязательно'})`} error={errors.email}>
                      <input name="email" type="email" value={form.email} onChange={handleChange}
                        className={[styles.input, errors.email ? styles.inputError : ''].join(' ')}
                        autoComplete="email" />
                    </Field>
                  </div>

                  <Field label={t.booking.format}>
                    <select name="format" value={form.format} onChange={handleChange} className={styles.input}>
                      {(['OFFLINE', 'ONLINE', 'HYBRID'] as CourseFormat[]).map(f => (
                        <option key={f} value={f}>{t.courses.formats[f]}</option>
                      ))}
                    </select>
                  </Field>

                  <div className={styles.row}>
                    <Field label={`${t.booking.group} (${lang === 'kg' ? 'милдеттүү эмес' : 'необязательно'})`}>
                      <input name="groupName" type="text" value={form.groupName} onChange={handleChange}
                        className={styles.input} />
                    </Field>
                    <Field label={t.booking.participants}>
                      <input name="participants" type="number" min={1} max={10}
                        value={form.participants} onChange={handleChange} className={styles.input} />
                    </Field>
                  </div>

                  <Field label={`${t.booking.comment} (${lang === 'kg' ? 'милдеттүү эмес' : 'необязательно'})`}>
                    <textarea name="comment" value={form.comment} onChange={handleChange}
                      className={[styles.input, styles.textarea].join(' ')} rows={4} />
                  </Field>

                  {apiError && <p className={styles.apiError}>{apiError}</p>}

                  <Button type="submit" variant="orange" size="lg" fullWidth loading={loading}>
                    {t.booking.submit}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-pink)', fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = params?.courseId as string;
  if (!id) return { props: { course: null } };

  // Try DB if configured
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import('@/lib/prisma');
      const db = await prisma.course.findUnique({ where: { id } });
      if (db) {
        return { props: { course: JSON.parse(JSON.stringify(db)) } };
      }
    } catch {
      // DB unavailable — return null course, form still works
    }
  }

  return { props: { course: null } };
};
