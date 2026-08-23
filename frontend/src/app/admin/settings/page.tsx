'use client';

import { Settings, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';

export default function AdminSettings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure platform settings and preferences"
      />

      <Card className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Settings className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          System settings will be available soon. This section will allow you to configure application settings, manage platform configurations, and customize system preferences.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>
      </Card>
    </div>
  );
}