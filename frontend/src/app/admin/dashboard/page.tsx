'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Users, CheckCircle, XCircle, FolderKanban, Key, Hammer, AlertCircle } from 'lucide-react';
import StatCard from '@/components/shared/ui/StatCard';
import Card from '@/components/shared/ui/Card';
import PageHeader from '@/components/shared/ui/PageHeader';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    blockedClients: 0,
    totalProjects: 0,
    activeLicenses: 0,
    totalBuilds: 0,
    failedBuilds: 0,
  });

  useEffect(() => {
    setStats({
      totalClients: 0,
      activeClients: 0,
      blockedClients: 0,
      totalProjects: 0,
      activeLicenses: 0,
      totalBuilds: 0,
      failedBuilds: 0,
    });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'Admin'}`}
        description="Here's what's happening with your platform today."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Clients"
          value={stats.activeClients}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Blocked Clients"
          value={stats.blockedClients}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="purple"
        />
        <StatCard
          title="Active Licenses"
          value={stats.activeLicenses}
          icon={Key}
          color="blue"
        />
        <StatCard
          title="Total Builds"
          value={stats.totalBuilds}
          icon={Hammer}
          color="orange"
        />
        <StatCard
          title="Failed Builds"
          value={stats.failedBuilds}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Clients</h3>
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent clients</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          <div className="text-center py-8">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent projects</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Builds</h3>
          <div className="text-center py-8">
            <Hammer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent builds</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">License Activity</h3>
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent license activity</p>
          </div>
        </Card>
      </div>
    </div>
  );
}