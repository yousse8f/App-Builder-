'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Plus } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Table from '@/components/shared/ui/Table';
import Badge from '@/components/shared/ui/Badge';
import Modal from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { License, LicenseType, LicenseStatus, CreateLicenseDto } from '@/types/license';
import type { Client } from '@/types/client';

export default function AdminLicenses() {
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  
  // Create license form state
  const [createForm, setCreateForm] = useState<CreateLicenseDto>({
    type: 'PLUGIN',
    clientId: '',
    domain: '',
    expiresAt: '',
    activationLimit: 1,
  });

  const fetchLicenses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/licenses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLicenses(data);
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/clients', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    void fetchLicenses();
    void fetchClients();
  }, [fetchLicenses, fetchClients]);

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        const newLicense = await response.json();
        setLicenses([newLicense, ...licenses]);
        setIsCreateModalOpen(false);
        setCreateForm({
          type: 'PLUGIN',
          clientId: '',
          domain: '',
          expiresAt: '',
          activationLimit: 1,
        });
        alert('License created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create license');
      }
    } catch (error) {
      console.error('Error creating license:', error);
      alert('Failed to create license');
    }
  };

  const getStatusBadge = (status: LicenseStatus) => {
    const statusConfig = {
      ACTIVE: { variant: 'success' as const },
      INACTIVE: { variant: 'default' as const },
      SUSPENDED: { variant: 'warning' as const },
      BLOCKED: { variant: 'danger' as const },
      EXPIRED: { variant: 'danger' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant} size="small">{status}</Badge>;
  };

  const getTypeBadge = (type: LicenseType) => {
    const typeConfig = {
      PLUGIN: { variant: 'info' as const, label: 'Plugin' },
      SCREEN_TEMPLATE: { variant: 'info' as const, label: 'Template' },
      BUILDER: { variant: 'success' as const, label: 'Builder' },
    };

    const config = typeConfig[type];
    return <Badge variant={config.variant} size="small">{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Licenses"
          description="Manage application licenses and activation keys"
        />
        <Card className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading licenses...</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Licenses"
        description="Manage application licenses and activation keys"
      />

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">Total Licenses</p>
            <p className="text-2xl font-bold text-gray-900">{licenses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {licenses.filter(l => l.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">Expired</p>
            <p className="text-2xl font-bold text-red-600">
              {licenses.filter(l => l.status === 'EXPIRED').length}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create License
        </Button>
      </div>

      <Card>
        <Table
          headers={[
            'License Key',
            'Type',
            'Client',
            'Status',
            'Domain',
            'Activations',
            'Expires',
            'Actions',
          ]}
        >
          {licenses.map((license) => (
            <tr key={license.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-sm">{license.key}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTypeBadge(license.type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {license.client.companyName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(license.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {license.domain || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {license.activationCount}/{license.activationLimit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {license.expiresAt 
                  ? new Date(license.expiresAt).toLocaleDateString()
                  : 'Never'
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => router.push(`/admin/licenses/${license.id}`)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Create License Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New License"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const form = document.getElementById('create-license-form') as HTMLFormElement | null;
                form?.requestSubmit();
              }}
            >
              Create License
            </Button>
          </div>
        }
      >
        <form id="create-license-form" onSubmit={handleCreateLicense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Type
            </label>
            <select
              value={createForm.type}
              onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as LicenseType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="PLUGIN">Plugin</option>
              <option value="SCREEN_TEMPLATE">Screen Template</option>
              <option value="BUILDER">Builder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={createForm.clientId}
              onChange={(e) => setCreateForm({ ...createForm, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain (Optional)
            </label>
            <Input
              type="text"
              value={createForm.domain}
              onChange={(e) => setCreateForm({ ...createForm, domain: e.target.value })}
              placeholder="example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date (Optional)
            </label>
            <Input
              type="date"
              value={createForm.expiresAt}
              onChange={(e) => setCreateForm({ ...createForm, expiresAt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activation Limit
            </label>
            <Input
              type="number"
              value={createForm.activationLimit}
              onChange={(e) => setCreateForm({ ...createForm, activationLimit: parseInt(e.target.value) || 1 })}
              min="1"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}