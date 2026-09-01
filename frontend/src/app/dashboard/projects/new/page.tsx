'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the templates page since we're not allowing generic project creation
    router.replace('/dashboard/templates');
  }, [router]);

  return null;
}