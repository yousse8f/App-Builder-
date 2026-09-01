'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Smartphone, Tablet, Monitor } from 'lucide-react';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/ui/Card';

interface ScreenshotsStudioProps {
  projectId: string;
  projectName: string;
  androidPackage?: string;
  iosBundleId?: string;
  description?: string;
  primaryColor?: string;
  template?: string;
  authToken?: string;
}

export default function ScreenshotsStudio({
  projectId,
  projectName,
  androidPackage,
  iosBundleId,
  description,
  primaryColor,
  template,
  authToken,
}: ScreenshotsStudioProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appshotUrl, setAppshotUrl] = useState<string>('');

  useEffect(() => {
    // Load the AppShots editor with proper authentication context
    const loadEditor = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage if not provided via props
        const token = authToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
        

        
        // Construct the AppShots URL with user context
        const baseUrl = process.env.NEXT_PUBLIC_APPSHOTS_URL || 'http://127.0.0.1:4321';
        const params = new URLSearchParams();
        
        // Only pass token for auto-login - userName is no longer supported
        if (token) params.append('token', token);
        if (projectId) params.append('projectId', projectId);
        
        const url = `${baseUrl}/?${params.toString()}`;
        setAppshotUrl(url);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load appshot editor:', err);
        setError('Failed to load screenshots editor');
        setLoading(false);
      }
    };

    void loadEditor();
  }, [projectId, authToken]);

  const handleBack = () => {
    window.history.back();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Monitor className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Screenshots Editor</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="secondary" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </Card>
        </div>
      </div>
    );
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
                <h1 className="text-xl font-bold text-gray-900">{projectName}</h1>
                <p className="text-sm text-gray-500">Screenshots Editor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                Screenshots
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Info Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-6 text-sm">
            {androidPackage && (
              <div className="flex items-center gap-2 text-gray-600">
                <Smartphone className="w-4 h-4" />
                <span className="font-medium">Android:</span>
                <span className="text-gray-500">{androidPackage}</span>
              </div>
            )}
            {iosBundleId && (
              <div className="flex items-center gap-2 text-gray-600">
                <Tablet className="w-4 h-4" />
                <span className="font-medium">iOS:</span>
                <span className="text-gray-500">{iosBundleId}</span>
              </div>
            )}
            {primaryColor && (
              <div className="flex items-center gap-2 text-gray-600">
                <div 
                  className="w-4 h-4 rounded border border-gray-300" 
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-gray-500">{primaryColor}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Info Bar */}
      <div className="bg-indigo-50 border-b border-indigo-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-indigo-900">Status:</span>
              <span className="text-indigo-700">Authenticated</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-600">
              <span className="text-xs">Secure Session Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots Editor Content */}
      <div className="h-[calc(100vh-180px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-500">Loading Screenshots Editor...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center max-w-2xl">
              <div className="text-red-500 mb-4">
                <Monitor className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Screenshots Editor</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="secondary" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Project
              </Button>
            </Card>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={appshotUrl}
            className="w-full h-full border-0"
            title="Screenshots Editor"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );
}