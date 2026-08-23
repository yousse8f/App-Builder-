'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { FolderKanban, Key, Hammer, LayoutTemplate, Plus, FolderOpen } from 'lucide-react';
import StatCard from '@/components/shared/ui/StatCard';
import Card from '@/components/shared/ui/Card';
import PageHeader from '@/components/shared/ui/PageHeader';
import Button from '@/components/shared/Button';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [stats] = useState({
    myProjects: 0,
    activeLicenses: 0,
    totalBuilds: 0,
    templates: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'User'}`}
        description={`Welcome back to ${user?.client?.companyName || 'App Builder'}`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="My Projects"
          value={stats.myProjects}
          icon={FolderKanban}
          color="blue"
        />
        <StatCard
          title="Active Licenses"
          value={stats.activeLicenses}
          icon={Key}
          color="green"
        />
        <StatCard
          title="Total Builds"
          value={stats.totalBuilds}
          icon={Hammer}
          color="orange"
        />
        <StatCard
          title="Available Templates"
          value={stats.templates}
          icon={LayoutTemplate}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            className="flex items-center justify-center gap-2"
            disabled
          >
            <Plus className="w-4 h-4" />
            Create New Project
          </Button>
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2"
            disabled
          >
            <FolderOpen className="w-4 h-4" />
            Browse Templates
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          <div className="text-center py-8">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent projects</p>
            <p className="text-gray-400 text-xs mt-2">Your applications will appear here once you create your first project.</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Builds</h3>
          <div className="text-center py-8">
            <Hammer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent builds</p>
            <p className="text-gray-400 text-xs mt-2">Your build history will appear here.</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">License Status</h3>
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No active licenses</p>
            <p className="text-gray-400 text-xs mt-2">License management will be available soon.</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-indigo-600 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Create your first project</p>
                <p className="text-xs text-gray-500">Start building your mobile application</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-600 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Choose a template</p>
                <p className="text-xs text-gray-500">Select from our professionally designed templates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-600 text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Customize and build</p>
                <p className="text-xs text-gray-500">Tailor your app and prepare for deployment</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}