'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ScreenshotsStudio } from '@/features/screenshots';
import { projectsApi, Project } from '@/lib/api/projects';
import { useAuth } from '@/lib/auth/auth-context';

export default function ScreenshotsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const projectId = params.projectId as string || searchParams.get('id') as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is missing');
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      try {
        setLoading(true);
        const data = await projectsApi.getById(projectId);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600">
              {error || 'The project you\'re looking for doesn\'t exist or you don\'t have access to it.'}
            </p>
            <p className="text-sm text-gray-400 mt-2">Project ID: {projectId || 'undefined'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScreenshotsStudio
      projectId={project.id}
      projectName={project.name}
      androidPackage={undefined} // Will be populated from project data when available
      iosBundleId={undefined} // Will be populated from project data when available
      description={project.description || undefined}
      primaryColor={undefined} // Will be populated from project data when available
      template={undefined} // Will be populated from project data when available
      authToken={localStorage.getItem('accessToken') || undefined}
      userName={user?.name}
    />
  );
}