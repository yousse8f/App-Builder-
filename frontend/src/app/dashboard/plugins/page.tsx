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
  license?: { key?: string; status?: string; expiresAt?: string | null };
};

export default function ClientPluginsPage() {
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const { data } = await pluginsApi.getAll();
        setPlugins(data || []);
      } finally {
        setLoading(false);
      }
    };

    void loadPlugins();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Plugins</h1>
        <p className="mt-2 text-sm text-gray-600">Review your assigned plugins, their status, and validity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 md:col-span-2 xl:col-span-3">Loading plugins...</div>
        ) : plugins.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500 md:col-span-2 xl:col-span-3">No plugins assigned to your account yet.</div>
        ) : (
          plugins.map((plugin) => (
            <div key={plugin.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{plugin.name}</h2>
                  <p className="text-xs text-gray-500">{plugin.slug}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${plugin.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : plugin.status === 'DISABLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {plugin.status}
                </span>
              </div>

              <dl className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between gap-4">
                  <dt>Version</dt>
                  <dd>{plugin.version}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>License</dt>
                  <dd className="truncate text-right">{plugin.license?.key || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Expiration</dt>
                  <dd>{plugin.license?.expiresAt ? new Date(plugin.license.expiresAt).toLocaleDateString() : 'Unlimited'}</dd>
                </div>
              </dl>

              <div className="mt-5">
                <Link href={`/dashboard/plugins/${plugin.id}`} className="inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
