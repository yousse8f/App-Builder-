'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function GlobalLanguageSwitcher() {
  const pathname = usePathname();
  const shouldShow = pathname === '/login' || pathname === '/register' || pathname === '/admin/login';

  if (!shouldShow) {
    return null;
  }

  return <LanguageSwitcher />;
}
