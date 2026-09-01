'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Key,
  Hammer,
  Puzzle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminLoginRoute = pathname === '/admin/login';

  useEffect(() => {
    if (!loading) {
      if (isAdminLoginRoute) {
        if (user) {
          router.push('/admin/dashboard');
        }
        return;
      }

      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, isAdminLoginRoute]);

  if (isAdminLoginRoute) {
    return <>{children}</>;
  }

  const navigation = [
    { name: t.dashboard.dashboardLabel, href: '/admin/dashboard', icon: LayoutDashboard },
    { name: t.dashboard.clients, href: '/admin/clients', icon: Users },
    { name: t.dashboard.projects, href: '/admin/projects', icon: FolderKanban },
    { name: (t.dashboard as any).templates || 'Templates', href: '/admin/templates', icon: Layout },
    { name: t.dashboard.licenses, href: '/admin/licenses', icon: Key },
    { name: 'Plugins', href: '/admin/plugins', icon: Puzzle },
    { name: t.dashboard.builds, href: '/admin/builds', icon: Hammer },
    { name: t.dashboard.settings, href: '/admin/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-white font-semibold text-lg">App Builder</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
               <span>{t.dashboard.logout}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="hidden lg:block">
                  <LayoutDashboard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{t.dashboard.adminDashboard}</h1>
                  <p className="text-sm text-gray-500">{t.dashboard.welcome} {user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
               <LanguageSwitcher variant="inline" />
               <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                 {t.dashboard.admin}
               </span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}