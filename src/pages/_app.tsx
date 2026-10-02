import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '@/context/LanguageContext';
import { AdminProvider } from '@/context/AdminContext';

export default function App({ Component, pageProps, router }: AppProps) {
  const isAdmin = router.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <AdminProvider>
        <Component {...pageProps} />
      </AdminProvider>
    );
  }

  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
