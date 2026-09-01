'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { FolderKanban, Key, Hammer, Layout, Plus } from 'lucide-react';
import StatCard from '@/components/shared/ui/StatCard';
import Card from '@/components/shared/ui/Card';
import PageHeader from '@/components/shared/ui/PageHeader';
import Button from '@/components/shared/Button';
import { useLanguage } from '@/lib/i18n/language-context';
import { projectsApi, Project } from '@/lib/api/projects';

export default function ClientDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [appshotProjects, setAppshotProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAppshot, setLoadingAppshot] = useState(true);
  const [openingAppshot, setOpeningAppshot] = useState(false);
  const [stats, setStats] = useState({
    myProjects: 0,
    myTemplates: 0,
    activeLicenses: 0,
    totalBuilds: 0,
  });

  const loadProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const data = await projectsApi.getAll();
      // Filter to show only projects that have been created (have screens or assets)
      const createdProjects = data.filter(project => 
        project.screens.length > 0
      );
      setProjects(createdProjects);
      // Update stats
      setStats(prev => ({
        ...prev,
        myProjects: createdProjects.length,
      }));
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const loadAppshotProjects = useCallback(async () => {
    try {
      setLoadingAppshot(true);
      
      // Get token
      const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token')) : null;

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch projects from AppShot server - server will use authenticated clientId
      const url = 'http://localhost:4321/api/projects';
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appshot projects');
      }
      const data = await response.json();
      setAppshotProjects(data);
      // Update stats with appshot projects count
      setStats(prev => ({
        ...prev,
        myTemplates: data.length,
      }));
    } catch (error) {
      console.error('Failed to load appshot projects:', error);
      setAppshotProjects([]);
      setStats(prev => ({
        ...prev,
        myTemplates: 0,
      }));
    } finally {
      setLoadingAppshot(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
    void loadAppshotProjects();
  }, [loadProjects, loadAppshotProjects]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.greeting.morning;
    if (hour < 18) return t.dashboard.greeting.afternoon;
    return t.dashboard.greeting.evening;
  };

  const handleViewAllProjects = () => {
    router.push('/dashboard/projects');
  };

  const handleCreateTemplate = () => {
    // Show loading state
    setOpeningAppshot(true);
    
    // Simulate loading delay then open AppShots editor with new project modal
    setTimeout(() => {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token')) : null;
      const params = new URLSearchParams();
      params.append('new', 'true');
      if (token) params.append('token', token);
      
      const appshotUrl = `http://localhost:4321/?${params.toString()}`;
      window.open(appshotUrl, '_blank');
      setOpeningAppshot(false);
    }, 1000); // 1 second loading delay
  };

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || t.dashboard.defaultUser}`}
        description={`${t.dashboard.welcomeBackTo} ${user?.client?.companyName || 'App Builder'}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title={t.dashboard.stats.myProjects} value={loadingProjects ? '...' : stats.myProjects} icon={FolderKanban} color="blue" />
        <StatCard title="My Templates" value={loadingAppshot ? '...' : appshotProjects.length} icon={Layout} color="purple" />
        <StatCard title={t.dashboard.stats.activeLicenses} value={stats.activeLicenses} icon={Key} color="green" />
        <StatCard title={t.dashboard.stats.totalBuilds} value={stats.totalBuilds} icon={Hammer} color="orange" />
      </div>

      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">MY PROJECTS</h3>
          <Button variant="secondary" size="small" onClick={handleViewAllProjects}>
            View All
          </Button>
        </div>
        
        {loadingProjects ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No projects yet</p>
            <p className="text-gray-400 text-xs mt-2">Projects will appear here when you create them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="w-8 h-8 text-white/80" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{project.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {project.screens.length} screen{project.screens.length !== 1 ? 's' : ''} · Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="primary"
                    size="small"
                    className="w-full"
                    onClick={() => router.push(`/dashboard/projects/${project.id}/editor`)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">MY TEMPLATES</h3>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="small"
              onClick={handleCreateTemplate}
              disabled={openingAppshot}
            >
              {openingAppshot ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Opening...
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 mr-1" />
                  Create
                </>
              )}
            </Button>
            <Button variant="secondary" size="small" onClick={() => router.push('/dashboard/templates')}>
              View All
            </Button>
          </div>
        </div>
        
        {loadingAppshot ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading templates...</p>
          </div>
        ) : appshotProjects.length === 0 ? (
          <div className="text-center py-8">
            <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No templates yet</p>
            <p className="text-gray-400 text-xs mt-2">Create templates to reuse designs across projects</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appshotProjects.slice(0, 3).map((project) => (
              <Card key={project.name} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 relative">
                  {project.thumbnail ? (
                    <img
                      src={`http://localhost:4321/api/projects/${encodeURIComponent(project.name)}/thumbnail`}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layout className="w-8 h-8 text-white/80" />
                    </div>
                  )}
                  {!project.thumbnail && (
                    <div className="w-full h-full flex items-center justify-center hidden">
                      <Layout className="w-8 h-8 text-white/80" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{project.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {typeof project.frames === 'number' ? project.frames : (project.frames?.length || 0)} frame{(typeof project.frames === 'number' ? project.frames : (project.frames?.length || 0)) !== 1 ? 's' : ''}
                  </p>
                  <Button
                    variant="primary"
                    size="small"
                    className="w-full"
                    onClick={() => {
                      const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token')) : null;
                      const params = new URLSearchParams();
                      params.append('project', project.name);
                      if (token) params.append('token', token);
                      
                      const appshotUrl = `http://localhost:4321/?${params.toString()}`;
                      window.open(appshotUrl, '_blank');
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.recent.recentBuilds}</h3>
          <div className="text-center py-8">
            <Hammer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noRecentBuilds}</p>
            <p className="text-gray-400 text-xs mt-2">{t.dashboard.empty.noBuildText}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.dashboard.gettingStarted.licenseStatus}</h3>
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t.dashboard.empty.noActiveLicenses}</p>
            <p className="text-gray-400 text-xs mt-2">{t.dashboard.empty.noLicenseText}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}