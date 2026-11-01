'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function AdminThemeToggle() {
  const [light, setLight] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setLight(document.documentElement.dataset.theme !== 'dark');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next = light ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('venera-theme', next);
    } catch {
      // theme still applies for this visit
    }
    setLight(!light);
  };

  return (
    <button
      type="button"
      className="v3-icon"
      onClick={toggle}
      aria-label={light ? 'تغییر به تم تیره' : 'تغییر به تم روشن'}
      aria-pressed={light}
    >
      {light ? <Moon aria-hidden="true" size={18} /> : <Sun aria-hidden="true" size={18} />}
    </button>
  );
}
