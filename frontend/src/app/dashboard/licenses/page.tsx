'use client';

import { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertTriangle, Clock, Shield, ExternalLink, Copy } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Badge from '@/components/shared/ui/Badge';
import { License, LicenseType, LicenseStatus } from '@/types/license';
import { api } from '@/lib/api/client';

export default function ClientLicenses() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyLicenses = async () => {
    try {
      const response = await api.get('/licenses/my-licenses');
      setLicenses(response.data);
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMyLicenses();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('License key copied to clipboard!');
  };

  const getStatusBadge = (status: LicenseStatus) => {
    const statusConfig = {
      ACTIVE: { variant: 'success' as const, icon: CheckCircle, label: 'Active' },
      INACTIVE: { variant: 'default' as const, icon: Clock, label: 'Inactive' },
      SUSPENDED: { variant: 'warning' as const, icon: AlertTriangle, label: 'Suspended' },
      BLOCKED: { variant: 'danger' as const, icon: Shield, label: 'Blocked' },
      EXPIRED: { variant: 'danger' as const, icon: Clock, label: 'Expired' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} size="small">
        <div className="flex items-center gap-1">
          <Icon className="w-3 h-3" />
          {config.label}
        </div>
      </Badge>
    );
  };

  const getTypeBadge = (type: LicenseType) => {
    const typeConfig = {
      PLUGIN: { variant: 'info' as const, label: 'Plugin', description: 'Plugin License' },
      SCREEN_TEMPLATE: { variant: 'info' as const, label: 'Template', description: 'Screen Template License' },
      BUILDER: { variant: 'success' as const, label: 'Builder', description: 'Builder License' },
    };

    const config = typeConfig[type];
    return (
      <div>
        <Badge variant={config.variant} size="small">{config.label}</Badge>
        <p className="text-xs text-gray-500 mt-1">{config.description}</p>
      </div>
    );
  };

  const getLicenseTypeIcon = (type: LicenseType) => {
    switch (type) {
      case 'PLUGIN':
        return '🔌';
      case 'SCREEN_TEMPLATE':
        return '📋';
      case 'BUILDER':
        return '🏗️';
      default:
        return '🔑';
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="My Licenses"
          description="View and manage your application licenses"
        />
        <Card className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading your licenses...</p>
        </Card>
      </div>
    );
  }

  if (licenses.length === 0) {
    return (
      <div>
        <PageHeader
          title="My Licenses"
          description="View and manage your application licenses"
        />
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Key className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Licenses Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You do not have any active licenses yet. Contact support to get started with licenses for your applications.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Licenses"
        description="View and manage your application licenses"
      />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <p className="text-sm text-gray-500">Total Activations</p>
          <p className="text-2xl font-bold text-indigo-600">
            {licenses.reduce((sum, l) => sum + l.activationCount, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenses.map((license) => (
          <Card key={license.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getLicenseTypeIcon(license.type)}</div>
                <div>
                  {getTypeBadge(license.type)}
                </div>
              </div>
              {getStatusBadge(license.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">License Key</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded flex-1">
                    {license.key}
                  </code>
                  <button
                    onClick={() => copyToClipboard(license.key)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Status</label>
                <div className="mt-1">
                  {getStatusBadge(license.status)}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Domain</label>
                <p className="text-sm text-gray-900 mt-1">
                  {license.domain || 'Not specified'}
                </p>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Activations</label>
                <p className="text-sm text-gray-900 mt-1">
                  {license.activationCount} / {license.activationLimit}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(license.activationCount / license.activationLimit) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Expiration</label>
                <p className="text-sm text-gray-900 mt-1">
                  {license.expiresAt 
                    ? new Date(license.expiresAt).toLocaleDateString()
                    : 'Never expires'
                  }
                </p>
              </div>
            </div>

            {license.activations.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
                  Active Domains
                </label>
                <div className="space-y-2">
                  {license.activations
                    .filter(a => a.status === 'ACTIVE')
                    .map((activation) => (
                      <div
                        key={activation.id}
                        className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">{activation.domain}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(activation.activatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {license.status === 'EXPIRED' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  This license has expired. Please contact support to renew.
                </p>
              </div>
            )}

            {license.status === 'SUSPENDED' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  This license is temporarily suspended. Please contact support for more information.
                </p>
              </div>
            )}

            {license.status === 'BLOCKED' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <Shield className="w-4 h-4 inline mr-1" />
                  This license has been blocked. Please contact support immediately.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}