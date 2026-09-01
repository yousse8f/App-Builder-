'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyTemplatesRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new templates page
    router.replace('/dashboard/templates');
  }, [router]);

  return null;
}
