'use client';

import { FolderKanban, Plus, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';

export default function ClientProjects() {
  return (
    <div>
      <PageHeader
        title="My Projects"
        description="Create and manage your mobile application projects"
        actions={
          <Button disabled className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        }
      />

      <Card className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <FolderKanban className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Project Management</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Project management will be available in Part 3. This section will allow you to create and manage your app projects, track their progress, and monitor build status.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>
      </Card>
    </div>
  );
}