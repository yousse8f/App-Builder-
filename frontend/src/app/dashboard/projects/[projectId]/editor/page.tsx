'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Smartphone, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { projectsApi, Project, ProjectScreen } from '@/lib/api/projects';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/ui/Card';
import { api } from '@/lib/api/client';



export default function ProjectEditorPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ProjectScreen | null>(null);
  const [showScreenshots, setShowScreenshots] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getById(projectId);
      setProject(data);
      if (data.screens.length > 0) {
        setActiveScreen(data.screens[0]);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      router.push('/dashboard/projects');
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  const handleBack = () => {
    router.push('/dashboard/projects');
  };

  const handleCreateScreenshots = () => {
    // Open appshot editor in a new tab/window
    const appshotUrl = `${process.env.NEXT_PUBLIC_APPSHOTS_URL || 'http://localhost:4321'}/?project=${encodeURIComponent(projectId)}`;
    window.open(appshotUrl, '_blank');
  };

  const handleDeleteScreenshot = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this screenshot?')) return;
    
    try {
      await projectsApi.removeAsset(assetId);
      await loadProject();
    } catch (error) {
      console.error('Failed to delete screenshot:', error);
    }
  };

  const handleDownloadScreenshot = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="small" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">{project.description || 'No description'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleCreateScreenshots}>
                <Smartphone className="w-4 h-4 mr-2" />
                Create Screenshots
              </Button>
              <Button variant="secondary" onClick={() => setShowScreenshots(!showScreenshots)}>
                <ImageIcon className="w-4 h-4 mr-2" />
                {showScreenshots ? 'Hide Screenshots' : 'View Screenshots'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Screens List */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Screens</h3>
              <div className="space-y-2">
                {project.screens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreen(screen)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeScreen?.id === screen.id
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{screen.name}</div>
                    <div className="text-xs text-gray-500">Screen {screen.order + 1}</div>
                  </button>
                ))}
                {project.screens.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No screens yet</p>
                    <Button variant="secondary" size="small" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Screen
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Center Panel - Canvas Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Screen Editor</h3>
              <div className="text-center py-12 text-gray-500">
                <p>Select a screen to edit its properties</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Screenshots Section */}
        {showScreenshots && (
          <div className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Exported Screenshots</h3>
              {project.assets.filter(asset => asset.type === 'screenshot').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No screenshots exported yet</p>
                  <p className="text-sm mt-2">Use the &quot;Create Screenshots&quot; button to generate screenshots</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.assets
                    .filter(asset => asset.type === 'screenshot')
                    .map((asset) => (
                      <div key={asset.id} className="relative group">
                        <div className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={api.defaults.baseURL + asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{asset.name}</p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDownloadScreenshot(api.defaults.baseURL + asset.url, asset.name)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Download"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteScreenshot(asset.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        {asset.deviceId && (
                          <p className="text-xs text-gray-500">{asset.deviceId}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}