'use client';

import { LayoutTemplate, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';

export default function ClientTemplates() {
  return (
    <div>
      <PageHeader
        title="Templates"
        description="Browse and select app templates for your projects"
      />

      <Card className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <LayoutTemplate className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Template Gallery</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          The template gallery will be available in Part 4. This section will allow you to browse and select professionally designed app templates for your projects.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>
      </Card>
    </div>
  );
}