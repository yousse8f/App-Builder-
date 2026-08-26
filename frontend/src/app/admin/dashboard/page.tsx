'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Users, CheckCircle, XCircle, FolderKanban, Key, Hammer, AlertCircle } from 'lucide-react';
import StatCard from '@/components/shared/ui/StatCard';
import Card from '@/components/shared/ui/Card';
import PageHeader from '@/components/shared/ui/PageHeader';
import { useLanguage } from '@/lib/i18n/language-context';
import { clientsApi } from '@/lib/api/clients';

type DashboardStats = {
  totalClients: number;
  activeClients: number;
  blockedClients: number;
  totalProjects: number;
  activeLicenses: number;
  totalBuilds: number;
  failedBuilds: number;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    blockedClients: 0,
    totalProjects: 0,
    activeLicenses: 0,
    totalBuilds: 0,
    failedBuilds: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        const response = await clientsApi.getClients({ page: 1, pageSize: 1000 });
        if (!isMounted) return;

        const clients = response.clients ?? [];
        const activeClients = clients.filter((client) => client.status === 'ACTIVE').length;
        const blockedClients = clients.filter((client) => client.status === 'BLOCKED').length;

        setStats({
          totalClients: clients.length,
          activeClients,
          blockedClients,
          totalProjects: 0,
          activeLicenses: 0,
          totalBuilds: 0,
          failedBuilds: 0,
        });
      } catch {
        if (isMounted) {
          setStats({
            totalClients: 0,
            activeClients: 0,
            blockedClients: 0,
            totalProjects: 0,
            activeLicenses: 0,
            totalBuilds: 0,
            failedBuilds: 0,
          });
        }
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    void fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.greeting.morning;
    if (hour < 18) return t.dashboard.greeting.afternoon;
    return t.dashboard.greeting.evening;
  };

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || t.dashboard.defaultAdmin}`}
        description={t.dashboard.summaryText}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title={t.dashboard.stats.totalClients} value={loadingStats ? '...' : stats.totalClients} icon={Users} color="blue" />
        <StatCard title={t.dashboard.stats.activeClients} value={loadingStats ? '...' : stats.activeClients} icon={CheckCircle} color="green" />
        <StatCard title={t.dashboard.stats.blockedClients} value={loadingStats ? '...' : stats.blockedClients} icon={XCircle} color="red" />
        <StatCard title={t.dashboard.stats.totalProjects} value={stats.totalProjects} icon={FolderKanban} color="purple" />
        <StatCard title={t.dashboard.stats.activeLicenses} value={stats.activeLicenses} icon={Key} color="blue" />
        <StatCard title={t.dashboard.stats.totalBuilds} value={stats.totalBuilds} icon={Hammer} color="orange" />
        <StatCard title={t.dashboard.stats.failedBuilds} value={stats.failedBuilds} icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.recentClients}</h3>
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noRecentClients}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.recentProjects}</h3>
          <div className="text-center py-8">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noRecentProjects}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.recentBuilds}</h3>
          <div className="text-center py-8">
            <Hammer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noRecentBuilds}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.licenseActivity}</h3>
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noLicenseActivity}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}