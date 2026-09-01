'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FolderKanban, Edit, Trash2 } from 'lucide-react';
import { projectsApi, Project } from '@/lib/api/projects';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      // Filter to show only projects that have been created (have screens or assets)
      const createdProjects = data.filter(project => 
        project.screens.length > 0
      );
      setProjects(createdProjects);
    } catch (error: any) {
      console.error('Failed to load projects:', error);
      
      // Handle client profile errors
      if (error.clientProfileError || error.response?.data?.message?.includes('Client not found')) {
        console.error('Client profile error detected');
        // Could show a banner or redirect to profile setup
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);



  const handleEditProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}/editor`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setDeletingProject(projectId);
    try {
      await projectsApi.delete(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeletingProject(null);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Projects"
        description="Manage your app projects"
      />

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500">
            You don't have any projects yet. Projects will appear here when you create them.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FolderKanban className="w-16 h-16 text-white/80" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>{project.screens.length} screen{project.screens.length !== 1 ? 's' : ''}</span>
                  <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="small"
                    className="flex-1"
                    onClick={() => handleEditProject(project.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={deletingProject === project.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}