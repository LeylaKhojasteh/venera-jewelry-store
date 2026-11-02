import '@/app/v3.css';
import Link from 'next/link';
import { NotFoundView } from '@/components/v3/NotFoundView';

export default function NotFound() {
  return (
    <div className="v3-root" style={{ minHeight: '100svh' }}>
      <header className="v3-header">
        <div className="v3-shell v3-header-inner">
          <Link href="/" className="v3-logo" aria-label="اکسسوری ونرا">
            <span className="v3-logo-mark">VENERA</span>
          </Link>
        </div>
      </header>
      <main>
        <NotFoundView />
      </main>
    </div>
  );
}
