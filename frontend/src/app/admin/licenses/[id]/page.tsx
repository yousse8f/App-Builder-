'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Key, Shield, AlertTriangle, CheckCircle, XCircle, Clock, ExternalLink, FileText, ArrowLeft, Copy } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Badge from '@/components/shared/ui/Badge';
import Button from '@/components/shared/Button';
import { License, LicenseType, LicenseStatus, LicenseLog } from '@/types/license';

export default function LicenseDetails() {
  const params = useParams();
  const router = useRouter();
  const licenseId = params.id as string;
  
  const [license, setLicense] = useState<License | null>(null);
  const [licenseLogs, setLicenseLogs] = useState<LicenseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchLicenseDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/licenses/${licenseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLicense(data);
      } else {
        alert('License not found');
        router.push('/admin/licenses');
      }
    } catch (error) {
      console.error('Error fetching license details:', error);
      alert('Failed to fetch license details');
      router.push('/admin/licenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchLicenseLogs = async () => {
    setLogsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/licenses/${licenseId}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLicenseLogs(data);
      }
    } catch (error) {
      console.error('Error fetching license logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!licenseId) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLicenseDetails();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLicenseLogs();
  }, [licenseId]);

  const handleUpdateLicenseStatus = async (status: LicenseStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/licenses/${licenseId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setLicense((current) => (current ? { ...current, status } : null));
        fetchLicenseLogs();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update license status');
      }
    } catch (error) {
      console.error('Error updating license status:', error);
      alert('Failed to update license status');
    }
  };

  const handleUnblockLicense = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/licenses/${licenseId}/unblock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLicense((current) => (current ? { ...current, status: 'ACTIVE' } : null));
        fetchLicenseLogs();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to unblock license');
      }
    } catch (error) {
      console.error('Error unblocking license:', error);
      alert('Failed to unblock license');
    }
  };

  const handleDeactivateLicense = async (licenseKey: string, domain: string) => {
    if (!confirm(`Are you sure you want to deactivate this license for ${domain}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/licenses/admin/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ licenseKey, domain }),
      });

      if (response.ok) {
        alert('License deactivated successfully');
        fetchLicenseDetails();
        fetchLicenseLogs();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to deactivate license');
      }
    } catch (error) {
      console.error('Error deactivating license:', error);
      alert('Failed to deactivate license');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('License key copied to clipboard!');
  };

  const getStatusBadge = (status: LicenseStatus) => {
    const statusConfig = {
      ACTIVE: { variant: 'success' as const, icon: CheckCircle },
      INACTIVE: { variant: 'default' as const, icon: XCircle },
      SUSPENDED: { variant: 'warning' as const, icon: AlertTriangle },
      BLOCKED: { variant: 'danger' as const, icon: Shield },
      EXPIRED: { variant: 'danger' as const, icon: Clock },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} size="small">
        <div className="flex items-center gap-1">
          <Icon className="w-3 h-3" />
          {status}
        </div>
      </Badge>
    );
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
          title="License Details"
          description="View license information and manage activations"
        />
        <Card className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading license details...</p>
        </Card>
      </div>
    );
  }

  if (!license) {
    return (
      <div>
        <PageHeader
          title="License Details"
          description="View license information and manage activations"
        />
        <Card className="p-12 text-center">
          <Key className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">License Not Found</h3>
          <p className="text-gray-500 mb-4">The license you are looking for does not exist.</p>
          <Button onClick={() => router.push('/admin/licenses')}>
            Back to Licenses
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="License Details"
        description="View license information and manage activations"
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Licenses', href: '/admin/licenses' },
          { label: license.key, href: `/admin/licenses/${licenseId}` },
        ]}
      />

      <div className="mb-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/admin/licenses')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Licenses
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">License Key:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-medium">{license.key}</code>
                    <button
                      onClick={() => copyToClipboard(license.key)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span>{getTypeBadge(license.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span>{getStatusBadge(license.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Client:</span>
                  <span className="text-sm font-medium">{license.client.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Domain:</span>
                  <span className="text-sm">{license.domain || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm">{new Date(license.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Updated:</span>
                  <span className="text-sm">{new Date(license.updatedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Expiration:</span>
                  <span className="text-sm">
                    {license.expiresAt 
                      ? new Date(license.expiresAt).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Activation Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activation Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Activation Limit:</span>
                  <span className="text-sm font-medium">{license.activationLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current Activations:</span>
                  <span className="text-sm font-medium">{license.activationCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Remaining:</span>
                  <span className="text-sm font-medium">
                    {license.activationLimit - license.activationCount}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Activation History */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activation History</h3>
              {license.activations.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {license.activations.map((activation) => (
                    <div key={activation.id} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{activation.domain}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={activation.status === 'ACTIVE' ? 'success' : 'default'} size="small">
                            {activation.status}
                          </Badge>
                          {activation.status === 'ACTIVE' && (
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeactivateLicense(license.key, activation.domain)}
                            >
                              Deactivate
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">IP:</span> {activation.ipAddress || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">User Agent:</span> {activation.userAgent || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Activated:</span> {new Date(activation.activatedAt).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Validated:</span> {activation.lastValidatedAt ? new Date(activation.lastValidatedAt).toLocaleString() : 'Never'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No activations yet</p>
              )}
            </div>
          </Card>

          {/* License Logs */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">License Logs</h3>
              {logsLoading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-indigo-600"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading logs...</p>
                </div>
              ) : licenseLogs.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                  {licenseLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div className="text-sm">
                          <span className="font-medium">{log.action}</span>
                          {log.domain && <span className="text-gray-500 ml-2">({log.domain})</span>}
                        </div>
                        <Badge 
                          variant={log.result === 'SUCCESS' ? 'success' : 'danger'} 
                          size="small"
                        >
                          {log.result}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No logs yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar - License Actions */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">License Actions</h3>
              <div className="space-y-3">
                {license.status === 'ACTIVE' && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateLicenseStatus('SUSPENDED')}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateLicenseStatus('BLOCKED')}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Block
                    </Button>
                  </>
                )}
                {license.status === 'SUSPENDED' && (
                  <>
                    <Button
                      onClick={() => handleUpdateLicenseStatus('ACTIVE')}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Reactivate
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateLicenseStatus('BLOCKED')}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Block
                    </Button>
                  </>
                )}
                {license.status === 'BLOCKED' && (
                  <>
                    <Button
                      onClick={handleUnblockLicense}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Unblock
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateLicenseStatus('INACTIVE')}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Revoke
                    </Button>
                  </>
                )}
                {license.status === 'INACTIVE' && (
                  <Button
                    onClick={() => handleUpdateLicenseStatus('ACTIVE')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* License Status Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
              <div className="space-y-3 text-sm">
                {license.status === 'ACTIVE' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      This license is active and can be used for validation.
                    </p>
                  </div>
                )}
                {license.status === 'SUSPENDED' && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      This license is temporarily suspended. Validation will fail until reactivated.
                    </p>
                  </div>
                )}
                {license.status === 'BLOCKED' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                      <Shield className="w-4 h-4 inline mr-1" />
                      This license has been blocked. All validation requests will be rejected.
                    </p>
                  </div>
                )}
                {license.status === 'EXPIRED' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                      <Clock className="w-4 h-4 inline mr-1" />
                      This license has expired. Please contact support to renew if needed.
                    </p>
                  </div>
                )}
                {license.status === 'INACTIVE' && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-800">
                      <XCircle className="w-4 h-4 inline mr-1" />
                      This license is inactive. Activate it to make it usable.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}