'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { pluginsApi } from '@/lib/api/client';

type PluginDetail = {
  id: string;
  name: string;
  description?: string | null;
  version: string;
  status: string;
  slug: string;
  config?: Record<string, unknown>;
  client?: { companyName?: string };
  license?: {
    key?: string;
    status?: string;
    expiresAt?: string | null;
    type?: string;
    domain?: string | null;
  };
  fileUrl?: string;
  fileKey?: string;
  logs?: Array<{ id: string; action: string; result: string; details?: string | null; createdAt: string }>;
};

export default function AdminPluginDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pluginId = params?.id ?? '';
  const [plugin, setPlugin] = useState<PluginDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPlugin = useCallback(async () => {
    try {
      const { data } = await pluginsApi.getById(pluginId);
      setPlugin(data);
      setError('');
    } catch {
      setError('Unable to load plugin details.');
    } finally {
      setLoading(false);
    }
  }, [pluginId]);

  useEffect(() => {
    if (!pluginId) {
      setLoading(false);
      return;
    }
    void loadPlugin();
  }, [pluginId, loadPlugin]);

  const handleToggle = async (action: 'activate' | 'deactivate') => {
    try {
      if (action === 'activate') await pluginsApi.activate(pluginId);
      else await pluginsApi.deactivate(pluginId);
      await loadPlugin();
    } catch {
      setError('Unable to update plugin status.');
    }
  };

  // Upload using XMLHttpRequest to support progress
  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    setError('');

    const xhr = new XMLHttpRequest();
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/plugins/${pluginId}/upload`;

    xhr.open('POST', url, true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    } catch {
      // ignore
    }

    const fd = new FormData();
    fd.append('file', file);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        // could set state to show progress
        // const percent = Math.round((ev.loaded / ev.total) * 100);
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          await loadPlugin();
        } catch {
          setError('Upload succeeded but failed to refresh plugin data');
        }
      } else {
        setError(`Upload failed: ${xhr.statusText || xhr.status}`);
      }
    };

    xhr.onerror = () => {
      setError('Upload failed due to network error');
    };

    xhr.send(fd);
  };

  const handleDownloadFile = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/plugins/${pluginId}/file`;
      const token = localStorage.getItem('accessToken');
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      if (!res.ok) throw new Error('File not found');
      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      let filename = 'plugin-file';
      const m = /filename="?([^;"]+)"?/.exec(disposition);
      if (m && m[1]) filename = m[1];
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Unable to download file');
    }
  };


  if (loading) {
    return <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading plugin...</div>;
  }

  if (!plugin) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || 'Plugin not found.'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/plugins" className="text-sm font-medium text-indigo-600">← Back to plugins</Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{plugin.name}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleToggle(plugin.status === 'ACTIVE' ? 'deactivate' : 'activate')} className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${plugin.status === 'ACTIVE' ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
            {plugin.status === 'ACTIVE' ? 'Disable' : 'Enable'}
          </button>
          <button onClick={async () => { await pluginsApi.remove(pluginId); router.push('/admin/plugins'); }} className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">Delete</button>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="group inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-200 px-3 py-2 text-sm">
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)} />
            <span className="text-xs text-gray-600 group-hover:text-gray-800">Upload plugin file</span>
          </label>

          {plugin.fileKey && (
            <button onClick={handleDownloadFile} className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700">Download file</button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Plugin Summary</h2>
          <dl className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Client</dt><dd>{plugin.client?.companyName || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Slug</dt><dd>{plugin.slug}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Version</dt><dd>{plugin.version}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Status</dt><dd>{plugin.status}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">License</dt><dd>{plugin.license?.key || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Type</dt><dd>{plugin.license?.type || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Expiration</dt><dd>{plugin.license?.expiresAt ? new Date(plugin.license.expiresAt).toLocaleDateString() : 'Unlimited'}</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Configuration</h2>
          <pre className="overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">{JSON.stringify(plugin.config || {}, null, 2)}</pre>
        </div>
      </div>

      {plugin.description && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Description</h2>
          <p className="text-sm text-gray-600">{plugin.description}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Plugin Logs</h2>
        {plugin.logs && plugin.logs.length > 0 ? (
          <div className="space-y-3">
            {plugin.logs.map((log) => (
              <div key={log.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">Result: {log.result}</div>
                {log.details && <div className="mt-1 text-xs text-gray-500">{log.details}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No logs yet.</p>
        )}
      </div>
    </div>
  );
}
