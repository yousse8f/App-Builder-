'use client';

import { useState, useEffect } from 'react';
import { Hammer, Download, Smartphone, Apple, PlayCircle, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';

interface Build {
  id: string;
  name: string;
  version?: string;
  status: 'PENDING' | 'PREPARING' | 'BUILDING' | 'COMPLETED' | 'FAILED';
  platform: 'ANDROID' | 'IOS';
  apkUrl?: string;
  ipaUrl?: string;
  createdAt: string;
  project: {
    name: string;
  };
}

export default function ClientBuilds() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/builds');
      if (response.ok) {
        const data = await response.json();
        setBuilds(data);
      }
    } catch (error) {
      console.error('Failed to fetch builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'BUILDING': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      case 'BUILDING': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'PREPARING': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ANDROID': return <PlayCircle className="w-5 h-5 text-green-600" />;
      case 'IOS': return <Apple className="w-5 h-5 text-gray-800" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  const handleDownload = (build: Build) => {
    const url = build.platform === 'ANDROID' ? build.apkUrl : build.ipaUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div>
      <PageHeader
        title="Builds"
        description="View and download your application builds"
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading builds...</p>
        </div>
      ) : builds.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Hammer className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Builds Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Start building your app by creating a project and generating your first build.
          </p>
          <Button href="/dashboard/projects">
            Go to Projects
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {builds.map((build) => (
            <Card key={build.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {getPlatformIcon(build.platform)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{build.name}</h3>
                    <p className="text-sm text-gray-500">
                      {build.project.name} · {build.version || 'No version'} · {build.platform}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(build.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(build.status)}`}>
                    {getStatusIcon(build.status)}
                    {build.status}
                  </span>

                  {build.status === 'COMPLETED' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(build)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}