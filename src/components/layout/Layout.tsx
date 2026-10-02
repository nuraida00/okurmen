import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  heroPage?: boolean;   // true = header is transparent, content starts at top
  noFooter?: boolean;
}

const SITE_NAME = 'OKURMEN';
const DEFAULT_DESC = 'OKURMEN — заманбап билим берүү борбору. Практикалык билим алып, жаңы мүмкүнчүлүктөргө жол ач.';

export default function Layout({ children, title, description, heroPage = false, noFooter = false }: Props) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description ?? DEFAULT_DESC} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={description ?? DEFAULT_DESC} />
        <meta property="og:type"        content="website" />
        <meta property="og:image"       content="/images/okurmen/logo.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <Header transparent={heroPage} />

        <main
          id="main-content"
          className={[
            styles.content,
            heroPage ? styles.heroPage : styles.withHeader,
          ].filter(Boolean).join(' ')}
        >
          {children}
        </main>

        {!noFooter && <Footer />}
      </div>
    </>
  );
}
