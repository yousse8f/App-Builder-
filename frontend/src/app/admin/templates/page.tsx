'use client';

import { LayoutTemplate, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';

export default function AdminTemplates() {
  return (
    <div>
      <PageHeader
        title="Templates"
        description="Create and manage app templates for clients to use"
        actions={
          <Button disabled className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" />
            Create Template
          </Button>
        }
      />

      <Card className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <LayoutTemplate className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Template Management</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          The Template Builder will be available in Part 4. This section will allow you to create and manage app templates that clients can use as starting points for their applications.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>
      </Card>
    </div>
  );
}