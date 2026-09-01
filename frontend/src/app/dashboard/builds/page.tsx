'use client';

import { useEffect } from 'react';

export default function ClientBuilds() {
  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token')) : null;
    const params = new URLSearchParams();
    params.append('new', 'true');
    if (token) params.append('token', token);

    const appshotUrl = `http://localhost:4321/?${params.toString()}`;
    window.open(appshotUrl, '_blank');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
        <p className="text-gray-600">Opening AppShot Editor...</p>
      </div>
    </div>
  );
}