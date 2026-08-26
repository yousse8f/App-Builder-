'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pluginsApi } from '@/lib/api/client';

type PluginItem = {
  id: string;
  name: string;
  slug: string;
  version: string;
  status: string;
  client?: { companyName?: string };
  license?: { key?: string; status?: string; expiresAt?: string | null };
};

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPlugins = async () => {
    try {
      const { data } = await pluginsApi.getAll();
      setPlugins(data || []);
      setError('');
    } catch {
      setError('Unable to load plugins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlugins();
  }, []);

  const handleChangeStatus = async (pluginId: string, action: 'activate' | 'deactivate') => {
    try {
      if (action === 'activate') {
        await pluginsApi.activate(pluginId);
      } else {
        await pluginsApi.deactivate(pluginId);
      }
      await loadPlugins();
    } catch {
      setError('Unable to update plugin status.');
    }
  };

  const handleDelete = async (pluginId: string) => {
    try {
      await pluginsApi.remove(pluginId);
      await loadPlugins();
    } catch {
      setError('Unable to delete plugin.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plugins</h1>
          <p className="mt-2 text-sm text-gray-600">Manage plugin licenses and client plugin activation.</p>
        </div>
        <Link
          href="/admin/plugins/new"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Create Plugin
        </Link>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading plugins...</div>
        ) : plugins.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No plugins created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">License</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {plugins.map((plugin) => (
                  <tr key={plugin.id} className="text-sm text-gray-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{plugin.name}</div>
                      <div className="text-xs text-gray-500">{plugin.slug}</div>
                    </td>
                    <td className="px-4 py-3">{plugin.client?.companyName || '—'}</td>
                    <td className="px-4 py-3">{plugin.license?.key || '—'}</td>
                    <td className="px-4 py-3">{plugin.version}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${plugin.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : plugin.status === 'DISABLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {plugin.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/plugins/${plugin.id}`} className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">View</Link>
                        {plugin.status === 'ACTIVE' ? (
                          <button onClick={() => handleChangeStatus(plugin.id, 'deactivate')} className="rounded-md border border-yellow-300 bg-yellow-50 px-2 py-1 text-xs text-yellow-800 hover:bg-yellow-100">Disable</button>
                        ) : (
                          <button onClick={() => handleChangeStatus(plugin.id, 'activate')} className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-100">Enable</button>
                        )}
                        <button onClick={() => handleDelete(plugin.id)} className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
