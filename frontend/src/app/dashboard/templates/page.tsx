'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [appshotProjects, setAppshotProjects] = useState<any[]>([]);
  const [loadingAppshot, setLoadingAppshot] = useState(true);
  const [refreshingAppshot, setRefreshingAppshot] = useState(false);
  const [deletingAppshotProject, setDeletingAppshotProject] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || localStorage.getItem('token');
    }
    return null;
  }, []);

  const loadAppshotProjects = useCallback(async () => {
    try {
      setLoadingAppshot(true);
      const token = getAuthToken();

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Get client's projects from AppShot - server will use authenticated clientId
      const url = 'http://localhost:4321/api/projects';

      const appshotResponse = await fetch(url, { headers });

      if (appshotResponse.ok) {
        const appshotData = await appshotResponse.json();
        setAppshotProjects(appshotData);
      } else {
        setAppshotProjects([]);
      }
    } catch (error) {
      console.error('Failed to load appshot projects:', error);
      setAppshotProjects([]);
    } finally {
      setLoadingAppshot(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    void loadAppshotProjects();
  }, [loadAppshotProjects, user?.client?.id]);

  const handleEditAppshotProject = (projectName: string) => {
    // Show loading state
    setEditingProject(projectName);
    
    // Simulate loading delay then open AppShots editor
    setTimeout(() => {
      const token = getAuthToken();
      const params = new URLSearchParams();
      params.append('project', projectName);
      if (token) params.append('token', token);
      
      const appshotUrl = `http://localhost:4321/?${params.toString()}`;
      window.open(appshotUrl, '_blank');
      setEditingProject(null);
    }, 1000); // 1 second loading delay
  };

  const handleRefreshAppshotProjects = async () => {
    setRefreshingAppshot(true);
    await loadAppshotProjects();
    setRefreshingAppshot(false);
  };

  const handleDeleteAppshotProject = async (projectName: string) => {
    if (!confirm(`Are you sure you want to delete the project "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingAppshotProject(projectName);
    try {
      const response = await fetch(`http://localhost:4321/api/project/${encodeURIComponent(projectName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      await loadAppshotProjects();
    } catch (error) {
      console.error('Failed to delete appshot project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setDeletingAppshotProject(null);
    }
  };

  if (loadingAppshot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Manage your app screenshot templates"
      />

      {/* Templates Grid */}
      {appshotProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500">
            Use the Builds button in the sidebar to create new templates
          </p>
        </Card>
      ) : (
        <>
          {/* AppShot Projects */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AppShot Projects</h3>
            <Button
              variant="secondary"
              size="small"
              onClick={handleRefreshAppshotProjects}
              disabled={refreshingAppshot}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshingAppshot ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appshotProjects.map((project) => (
              <Card key={project.name} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-emerald-500 to-teal-600 relative">
                  <div className="w-full h-full flex items-center justify-center">
                    <Layout className="w-16 h-16 text-white/80" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      AppShot
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{project.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {typeof project.frames === 'number' ? project.frames : (project.frames?.length || 0)} frame{(typeof project.frames === 'number' ? project.frames : (project.frames?.length || 0)) !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="small"
                      className="flex-1"
                      onClick={() => handleEditAppshotProject(project.name)}
                      disabled={editingProject === project.name}
                    >
                      {editingProject === project.name ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          Opening...
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleDeleteAppshotProject(project.name)}
                      disabled={deletingAppshotProject === project.name}
                    >
                      {deletingAppshotProject === project.name ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-1"></div>
                          Deleting...
                        </>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}