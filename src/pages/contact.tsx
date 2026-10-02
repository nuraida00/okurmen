import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import styles from './contact.module.css';

export default function ContactPage() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError(t.booking.required); return; }
    setError('');
    // Will POST to API when backend is ready
    setSent(true);
  };

  return (
    <Layout title={t.nav.contact}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <SectionTitle
            tag="OKURMEN"
            title={t.contact.sectionTitle}
            white
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {/* Info */}
            <div className={styles.info}>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>
                  {lang === 'kg' ? 'Байланыш маалыматы' : 'Контактная информация'}
                </h2>

                {[
                  { icon: '📞', label: t.contact.phone,        value: null },
                  { icon: '📍', label: t.contact.address,      value: null },
                  { icon: '🕐', label: t.contact.workingHours, value: null },
                ].map(item => (
                  <div key={item.label} className={styles.infoRow}>
                    <div className={styles.infoIcon}>{item.icon}</div>
                    <div>
                      <div className={styles.infoLabel}>{item.label}</div>
                      <div className={styles.infoValue}>
                        {item.value ?? <span className={styles.placeholder}>{t.common.soonContent}</span>}
                      </div>
                    </div>
                  </div>
                ))}

                <div className={styles.socials}>
                  <h3 className={styles.socialsTitle}>{t.footer.followUs}</h3>
                  <div className={styles.socialRow}>
                    {['Instagram', 'Telegram', 'WhatsApp', 'Facebook'].map(s => (
                      <a key={s} href="#" className={styles.socialBtn} aria-label={s}>
                        {s.slice(0, 2).toUpperCase()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formWrap}>
              <h2 className={styles.formTitle}>{t.contact.sendMessage}</h2>

              {sent ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>✓</div>
                  <p>{t.booking.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">{t.contact.name}</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={styles.input}
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">{t.booking.phone}</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={styles.input}
                      required
                      autoComplete="tel"
                      placeholder="+996 ..."
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="message">{t.contact.message}</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className={[styles.input, styles.textarea].join(' ')}
                      rows={5}
                    />
                  </div>

                  {error && <p className={styles.errorMsg}>{error}</p>}

                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    {t.contact.submit}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
