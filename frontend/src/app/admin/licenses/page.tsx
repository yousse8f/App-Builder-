'use client';

import { Key, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';

export default function AdminLicenses() {
  return (
    <div>
      <PageHeader
        title="Licenses"
        description="Manage application licenses and activation keys"
      />

      <Card className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Key className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">License Management</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          License management will be available in Part 7. This section will allow you to manage app licenses, generate activation keys, and monitor license usage across the platform.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>
      </Card>
    </div>
  );
}