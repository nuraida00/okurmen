import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Button from '@/components/ui/Button';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

interface Props {
  transparent?: boolean; // Hero pages start transparent
}

export default function Header({ transparent = false }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  const headerClass = [
    styles.header,
    transparent && !scrolled ? styles.headerTransparent : '',
    scrolled ? styles.headerScrolled : '',
    !transparent ? styles.headerSolid : '',
  ].filter(Boolean).join(' ');

  const navItems = [
    { href: '/',           label: t.nav.home       },
    { href: '/courses',    label: t.nav.courses    },
    { href: '/about',      label: t.nav.about      },
    { href: '/team',       label: t.nav.team       },
    { href: '/graduates',  label: t.nav.graduates  },
    { href: '/reviews',    label: t.nav.reviews    },
    { href: '/contact',    label: t.nav.contact    },
  ];

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <>
      <header className={headerClass} role="banner">
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="OKURMEN — башкы бетке кайтуу">
            <Image
              src="/images/okurmen/logo.png"
              alt="OKURMEN Logo"
              width={120}
              height={44}
              className={styles.logoImg}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} aria-label="Main navigation">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  styles.navLink,
                  isActive(item.href) ? styles.navLinkActive : '',
                ].filter(Boolean).join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className={styles.right}>
            <LanguageSwitcher theme="light" />

            {/* Book button — desktop only */}
            <Button
              as="a"
              href="/courses"
              variant="orange"
              size="sm"
              className={styles.desktopBookBtn}
              aria-label={t.nav.bookCourse}
            >
              {t.nav.bookCourse}
            </Button>

            {/* Hamburger */}
            <button
              className={[styles.hamburger, menuOpen ? styles.hamburgerOpen : ''].filter(Boolean).join(' ')}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Менюну жабуу' : 'Менюну ачуу'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className={styles.hamburgerLine} aria-hidden />
              <span className={styles.hamburgerLine} aria-hidden />
              <span className={styles.hamburgerLine} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        id="mobile-menu"
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        activeHref={router.pathname}
      />
    </>
  );
}
