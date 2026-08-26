'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pluginsApi } from '@/lib/api/client';

type PluginDetail = {
  id: string;
  name: string;
  description?: string | null;
  version: string;
  status: string;
  slug: string;
  config?: Record<string, unknown>;
  license?: {
    key?: string;
    status?: string;
    expiresAt?: string | null;
    type?: string;
    domain?: string | null;
  };
  logs?: Array<{ id: string; action: string; result: string; details?: string | null; createdAt: string }>;
};

export default function ClientPluginDetailPage() {
  const params = useParams<{ id: string }>();
  const pluginId = params?.id ?? '';
  const [plugin, setPlugin] = useState<PluginDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPlugin = async () => {
    try {
      const { data } = await pluginsApi.getById(pluginId);
      setPlugin(data);
      setError('');
    } catch {
      setError('Unable to load plugin details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pluginId) {
      setLoading(false);
      return;
    }
    void loadPlugin();
  }, [pluginId]);

  const handleToggle = async (action: 'activate' | 'deactivate') => {
    try {
      if (action === 'activate') {
        await pluginsApi.activate(pluginId);
      } else {
        await pluginsApi.deactivate(pluginId);
      }
      await loadPlugin();
    } catch {
      setError('Unable to update plugin status.');
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
          <Link href="/dashboard/plugins" className="text-sm font-medium text-indigo-600">← Back to plugins</Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{plugin.name}</h1>
        </div>
        <button
          onClick={() => handleToggle(plugin.status === 'ACTIVE' ? 'deactivate' : 'activate')}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${plugin.status === 'ACTIVE' ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
        >
          {plugin.status === 'ACTIVE' ? 'Disable' : 'Enable'}
        </button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Plugin Details</h2>
          <dl className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Version</dt><dd>{plugin.version}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Slug</dt><dd>{plugin.slug}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Status</dt><dd>{plugin.status}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">License</dt><dd>{plugin.license?.key || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">License Type</dt><dd>{plugin.license?.type || '—'}</dd></div>
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
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
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
          <p className="text-sm text-gray-500">No activity logged yet.</p>
        )}
      </div>
    </div>
  );
}
