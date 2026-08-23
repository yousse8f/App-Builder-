'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role === 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen p-4">
          <div className="text-white text-xl font-bold mb-8">Client Panel</div>
          <nav className="space-y-2">
            <a href="/dashboard" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-800">
              Dashboard
            </a>
            <a href="/dashboard/projects" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-800">
              My Projects
            </a>
            <a href="/dashboard/templates" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-800">
              Templates
            </a>
            <a href="/dashboard/licenses" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-800">
              Licenses
            </a>
            <a href="/dashboard/builds" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-800">
              Builds
            </a>
            <a href="/dashboard/profile" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-800">
              Profile
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.client?.companyName || 'Client'}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}