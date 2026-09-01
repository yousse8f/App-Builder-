'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FolderKanban, Edit, Trash2, Smartphone, Tablet, Monitor, Play, Loader2, Download } from 'lucide-react';
import { projectsApi, Project } from '@/lib/api/projects';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [appshotFrameCounts, setAppshotFrameCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [downloadingProject, setDownloadingProject] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      // Filter to show only projects that have been created (have screens, assets, or are screenshots projects)
      const createdProjects = data.filter(project => 
        project.screens.length > 0 || 
        project.assets.length > 0 || 
        project.projectType === 'screenshots'
      );
      setProjects(createdProjects);

      // Load frame counts for AppShot projects
      const frameCounts: Record<string, number> = {};
      for (const project of createdProjects) {
        if (project.projectType === 'screenshots' && project.appshotProjectName) {
          try {
            const appshotData = await projectsApi.getAppshotProject(project.appshotProjectName);
            frameCounts[project.id] = appshotData.frames?.length || 0;
          } catch (error) {
            console.error(`Failed to load AppShot project ${project.appshotProjectName}:`, error);
            frameCounts[project.id] = 0;
          }
        }
      }
      setAppshotFrameCounts(frameCounts);
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

  const getProjectThumbnail = (project: Project) => {
    // Try to get thumbnail from assets
    const thumbnailAsset = project.assets.find(asset => asset.type === 'thumbnail' || asset.name.includes('thumbnail'));
    if (thumbnailAsset?.url) return thumbnailAsset.url;
    
    // Return project thumbnailUrl if available
    if (project.thumbnailUrl) return project.thumbnailUrl;
    
    return null;
  };

  const getProjectCategory = (project: Project) => {
    if (project.projectType === 'screenshots') return 'Screenshots';
    if (project.platform === 'IOS') return 'iOS App';
    if (project.platform === 'ANDROID') return 'Android App';
    return 'Cross-Platform';
  };

  const getDeviceSupport = (project: Project) => {
    const devices = [];
    if (project.platform === 'IOS' || project.platform === 'BOTH') {
      devices.push('iPhone', 'iPad');
    }
    if (project.platform === 'ANDROID' || project.platform === 'BOTH') {
      devices.push('Android Phone', 'Android Tablet');
    }
    if (devices.length === 0) {
      devices.push('All Devices');
    }
    return devices;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="My Projects"
        description="Manage your app projects"
        actions={
          <Button
            onClick={() => router.push('/dashboard/projects/new')}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            New Project
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">
              You don't have any projects yet. Projects will appear here when you create them.
            </p>
            <Button onClick={() => router.push('/dashboard/projects/new')}>
              <Play className="w-4 h-4 mr-1" />
              Create Your First Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const thumbnail = getProjectThumbnail(project);
              const category = getProjectCategory(project);
              const deviceSupport = getDeviceSupport(project);
              
              return (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Preview Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {project.projectType === 'screenshots' ? (
                          <div className="text-white/80 text-center">
                            <div className="text-4xl mb-2">📸</div>
                            <div className="text-sm font-medium">Screenshots</div>
                          </div>
                        ) : (
                          <FolderKanban className="w-16 h-16 text-white/60" />
                        )}
                      </div>
                    )}
                    {!thumbnail && (
                      <div className="w-full h-full flex items-center justify-center hidden">
                        {project.projectType === 'screenshots' ? (
                          <div className="text-white/80 text-center">
                            <div className="text-4xl mb-2">📸</div>
                            <div className="text-sm font-medium">Screenshots</div>
                          </div>
                        ) : (
                          <FolderKanban className="w-16 h-16 text-white/60" />
                        )}
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm">
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                    )}
                    
                    {/* Compatible Devices */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">Compatible with:</div>
                      <div className="flex flex-wrap gap-2">
                        {deviceSupport.map(device => (
                          <span key={device} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                            {device.includes('iPhone') && <Smartphone className="w-3 h-3 mr-1" />}
                            {device.includes('iPad') && <Tablet className="w-3 h-3 mr-1" />}
                            {device.includes('Android') && <Monitor className="w-3 h-3 mr-1" />}
                            {device}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>
                        {project.projectType === 'screenshots' 
                          ? `${appshotFrameCounts[project.id] || 0} frame${(appshotFrameCounts[project.id] || 0) !== 1 ? 's' : ''}`
                          : `${project.screens.length} screen${project.screens.length !== 1 ? 's' : ''}`
                        }
                      </span>
                      <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {project.projectType === 'screenshots' ? (
                        <Button
                          variant="primary"
                          size="small"
                          className="flex-1"
                          onClick={async () => {
                            try {
                              setDownloadingProject(project.id);
                              await projectsApi.downloadScreenshots(project.appshotProjectName || '');
                            } catch (error: any) {
                              console.error('Failed to download screenshots:', error);
                              if (error.response?.status === 404) {
                                alert('No exported screenshots found for this project. Please export screenshots first using the AppShot editor.');
                              } else if (error.response?.status === 403) {
                                alert('Access denied. You do not have permission to download these screenshots.');
                              } else {
                                alert('Failed to download screenshots. Please try again.');
                              }
                            } finally {
                              setDownloadingProject(null);
                            }
                          }}
                          disabled={downloadingProject === project.id}
                        >
                          {downloadingProject === project.id ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 mr-1" />
                          )}
                          {downloadingProject === project.id ? 'Downloading...' : 'Download Screenshots'}
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="small"
                          className="flex-1"
                          onClick={() => handleEditProject(project.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={deletingProject === project.id}
                      >
                        {deletingProject === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}