'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { clientsApi } from '@/lib/api/clients';
import { Client, UpdateClientDto } from '@/types/client';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function EditClient() {
  const router = useRouter();
  const params = useParams();
  const clientId = typeof params.id === 'string' ? params.id : '';
  const hasClientId = Boolean(clientId);
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<UpdateClientDto>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(hasClientId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hasClientId) {
      return;
    }

    let isMounted = true;

    const fetchClient = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await clientsApi.getClient(clientId);

        if (!isMounted) {
          return;
        }

        setClient(data);
        setFormData({
          companyName: data.companyName,
          status: data.status,
        });
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }

        const apiError = err as ApiError;
        setError(apiError.response?.data?.message || 'Failed to load client');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchClient();

    return () => {
      isMounted = false;
    };
  }, [clientId, hasClientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await clientsApi.updateClient(clientId, formData);
      router.push(`/admin/clients/${clientId}`);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to update client');
    } finally {
      setSaving(false);
    }
  };

  if (!hasClientId) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Client not found
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading client details...</div>;
  }

  if (error || !client) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Client not found'}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/admin/clients/${params.id}`)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          ← Back to Client Details
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Edit Client</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.companyName || ''}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.status || client.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
            >
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/admin/clients/${params.id}`)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}