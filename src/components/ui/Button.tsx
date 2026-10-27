import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'light' | 'ghost-dark';
type Size = 'md' | 'sm';

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  light: 'btn-light',
  'ghost-dark': 'btn-ghost-dark',
};

export function buttonClass({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
}: {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
} = {}) {
  return cn('btn', variants[variant], size === 'sm' && 'btn-sm', block && 'btn-block', className);
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
};

export function Button({ variant, size, block, className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonClass({ variant, size, block, className })} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant, size, block, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, block, className })} {...props}>
      {children}
    </Link>
  );
}
