'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { clientsApi } from '@/lib/api/clients';
import { Client } from '@/types/client';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function ClientDetails() {
  const router = useRouter();
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadClient = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clientsApi.getClient(params.id as string);
      setClient(data);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchClient = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await clientsApi.getClient(params.id as string);

        if (!isMounted) {
          return;
        }

        setClient(data);
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
  }, [params.id]);

  const handleBlock = async () => {
    setActionLoading(true);
    try {
      await clientsApi.blockClient(params.id as string);
      await loadClient();
      setShowBlockDialog(false);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to block client');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async () => {
    setActionLoading(true);
    try {
      await clientsApi.unblockClient(params.id as string);
      await loadClient();
      setShowUnblockDialog(false);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to unblock client');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
    <div className="max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/clients')}
          className="text-indigo-600 hover:text-indigo-900"
        >
          ← Back to Clients
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{client.companyName}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(client.status)}`}>
            {client.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Client ID</h3>
            <p className="text-gray-900">{client.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <p className="text-gray-900">{client.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created Date</h3>
            <p className="text-gray-900">{new Date(client.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
            <p className="text-gray-900">{new Date(client.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-sm font-medium text-gray-500">Projects</h4>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-sm font-medium text-gray-500">Licenses</h4>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-sm font-medium text-gray-500">Builds</h4>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => router.push(`/admin/clients/${client.id}/edit`)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Edit Client
          </button>
          {client.status === 'ACTIVE' ? (
            <button
              onClick={() => setShowBlockDialog(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Block Client
            </button>
          ) : (
            <button
              onClick={() => setShowUnblockDialog(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Unblock Client
            </button>
          )}
        </div>
      </div>

      {/* Block Confirmation Dialog */}
      {showBlockDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Block Client</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to block {client.companyName}? This will prevent them from accessing the system.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleBlock}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Blocking...' : 'Block Client'}
              </button>
              <button
                onClick={() => setShowBlockDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Confirmation Dialog */}
      {showUnblockDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Unblock Client</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unblock {client.companyName}? They will regain access to the system.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleUnblock}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? 'Unblocking...' : 'Unblock Client'}
              </button>
              <button
                onClick={() => setShowUnblockDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}