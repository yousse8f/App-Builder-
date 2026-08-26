'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { FolderKanban, Key, Hammer, LayoutTemplate, Plus, FolderOpen } from 'lucide-react';
import StatCard from '@/components/shared/ui/StatCard';
import Card from '@/components/shared/ui/Card';
import PageHeader from '@/components/shared/ui/PageHeader';
import Button from '@/components/shared/Button';
import { useLanguage } from '@/lib/i18n/language-context';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats] = useState({
    myProjects: 0,
    activeLicenses: 0,
    totalBuilds: 0,
    templates: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.greeting.morning;
    if (hour < 18) return t.dashboard.greeting.afternoon;
    return t.dashboard.greeting.evening;
  };

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || t.dashboard.defaultUser}`}
        description={`${t.dashboard.welcomeBackTo} ${user?.client?.companyName || 'App Builder'}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title={t.dashboard.stats.myProjects} value={stats.myProjects} icon={FolderKanban} color="blue" />
        <StatCard title={t.dashboard.stats.activeLicenses} value={stats.activeLicenses} icon={Key} color="green" />
        <StatCard title={t.dashboard.stats.totalBuilds} value={stats.totalBuilds} icon={Hammer} color="orange" />
        <StatCard title={t.dashboard.stats.availableTemplates} value={stats.templates} icon={LayoutTemplate} color="purple" />
      </div>

      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.quickActions}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="primary" className="flex items-center justify-center gap-2" disabled>
            <Plus className="w-4 h-4" />
            {t.dashboard.recent.createProject}
          </Button>
          <Button variant="secondary" className="flex items-center justify-center gap-2" disabled>
            <FolderOpen className="w-4 h-4" />
            {t.dashboard.recent.browseTemplates}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.recentProjects}</h3>
          <div className="text-center py-8">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noRecentProjects}</p>
            <p className="text-gray-400 text-xs mt-2">{t.dashboard.empty.noRecentText}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.recentBuilds}</h3>
          <div className="text-center py-8">
            <Hammer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noRecentBuilds}</p>
            <p className="text-gray-400 text-xs mt-2">{t.dashboard.empty.noBuildText}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.gettingStarted.licenseStatus}</h3>
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noActiveLicenses}</p>
            <p className="text-gray-400 text-xs mt-2">{t.dashboard.empty.noLicenseText}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.gettingStarted}</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-indigo-600 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{t.dashboard.gettingStarted.step1Title}</p>
                <p className="text-xs text-gray-500">{t.dashboard.gettingStarted.step1Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-600 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{t.dashboard.gettingStarted.step2Title}</p>
                <p className="text-xs text-gray-500">{t.dashboard.gettingStarted.step2Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-600 text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{t.dashboard.gettingStarted.step3Title}</p>
                <p className="text-xs text-gray-500">{t.dashboard.gettingStarted.step3Desc}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}