import React, { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

type Variant = 'primary' | 'orange' | 'outline' | 'outlineWhite' | 'ghost' | 'pink';
type Size    = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button';
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: 'a';
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size    = 'md',
      fullWidth = false,
      loading = false,
      children,
      className = '',
      ...rest
    } = props;

    const cls = [
      styles.btn,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (props.as === 'a' && props.href) {
      return (
        <Link href={props.href} className={cls} ref={ref as React.Ref<HTMLAnchorElement>}>
          {loading && <span className={styles.spinner} aria-hidden />}
          {children}
        </Link>
      );
    }

    const { as: _as, ...buttonRest } = rest as ButtonAsButton;
    return (
      <button
        className={cls}
        disabled={loading || (buttonRest as ButtonHTMLAttributes<HTMLButtonElement>).disabled}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {loading && <span className={styles.spinner} aria-hidden />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
