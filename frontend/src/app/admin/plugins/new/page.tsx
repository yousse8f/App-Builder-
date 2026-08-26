'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, pluginsApi } from '@/lib/api/client';

type Client = {
  id: string;
  companyName: string;
};

type License = {
  id: string;
  key: string;
  type: string;
  clientId: string;
  status: string;
  expiresAt?: string | null;
};

export default function CreatePluginPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedLicenseId, setSelectedLicenseId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [fileUrl, setFileUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [config, setConfig] = useState('{"enabled":false,"theme":"default","settings":{}}');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsResponse, licensesResponse] = await Promise.all([
          api.get('/clients'),
          api.get('/licenses'),
        ]);
        setClients(clientsResponse.data || []);
        setLicenses(licensesResponse.data || []);
      } catch {
        setError('Unable to load clients and licenses.');
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const availableLicenses = licenses.filter(
    (license) => license.clientId === selectedClientId && license.type === 'PLUGIN',
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const parsedConfig = JSON.parse(config || '{}');

      // Basic JSON schema checks (lightweight)
      if (typeof parsedConfig !== 'object' || Array.isArray(parsedConfig)) {
        throw new Error('Config must be a JSON object');
      }

      if ('enabled' in parsedConfig && typeof parsedConfig.enabled !== 'boolean') {
        throw new Error('Config field "enabled" must be a boolean');
      }

      if ('theme' in parsedConfig && typeof parsedConfig.theme !== 'string') {
        throw new Error('Config field "theme" must be a string');
      }

      await pluginsApi.create({
        name,
        slug,
        description,
        version,
        clientId: selectedClientId,
        licenseId: selectedLicenseId || undefined,
        fileUrl: fileUrl || undefined,
        iconUrl: iconUrl || undefined,
        status: 'INACTIVE',
        config: parsedConfig,
      });
      router.push('/admin/plugins');
    } catch (err: any) {
      setError(err?.message || 'Unable to create plugin. Please verify the selected client and license.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Plugin</h1>
        <p className="mt-2 text-sm text-gray-600">Create a plugin, attach it to a client, and link a valid plugin license.</p>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading form...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Plugin Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Slug</span>
              <input value={slug} onChange={(event) => setSlug(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-gray-700">
            <span>Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
          </label>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Version</span>
              <input value={version} onChange={(event) => setVersion(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Client</span>
              <select value={selectedClientId} onChange={(event) => { setSelectedClientId(event.target.value); setSelectedLicenseId(''); }} required className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500">
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.companyName}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Plugin License</span>
              <select value={selectedLicenseId} onChange={(event) => setSelectedLicenseId(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500">
                <option value="">No license selected</option>
                {availableLicenses.map((license) => (
                  <option key={license.id} value={license.id}>{license.key}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>File URL</span>
              <input value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Icon URL</span>
              <input value={iconUrl} onChange={(event) => setIconUrl(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500" />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-gray-700">
            <span>Config JSON</span>
            <textarea value={config} onChange={(event) => setConfig(event.target.value)} rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs outline-none focus:border-indigo-500" />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Creating...' : 'Create Plugin'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
