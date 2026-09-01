'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Eye, RefreshCw, Users, Loader2, Trash2, Plus, X, Check } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';
import { clientsApi } from '@/lib/api/clients';
import { api } from '@/lib/api/client';
import { Client } from '@/types/client';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface ClientTemplate {
  id: string;
  clientId: string;
  templateId: string;
  customName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTemplates() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [clientTemplates, setClientTemplates] = useState<ClientTemplate[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assigningTemplate, setAssigningTemplate] = useState<string | null>(null);
  const [removingTemplate, setRemovingTemplate] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load clients
      const clientsResponse = await clientsApi.getClients({ page: 1, pageSize: 1000 });
      const clientsData = clientsResponse.clients ?? [];
      setClients(clientsData);
      console.log('Clients loaded:', clientsData.length);

      // Load all available templates (admin view - no clientId filter)
      try {
        const templatesResponse = await api.get('/screenshots/templates');
        console.log('Templates data received:', templatesResponse.data);
        setAllTemplates(templatesResponse.data);
      } catch (error) {
        console.error('Failed to load templates:', error);
        setAllTemplates([]);
      }

      // Load client template assignments if a client is selected
      if (selectedClient) {
        console.log('Loading templates for client:', selectedClient);
        try {
          const clientTemplatesResponse = await api.get(`/clients/${selectedClient}/templates`);
          console.log('Client templates data received:', clientTemplatesResponse.data);
          setClientTemplates(clientTemplatesResponse.data);
        } catch (error) {
          console.error('Failed to load client templates:', error);
          setClientTemplates([]);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAssignTemplate = async (templateId: string, customName?: string) => {
    if (!selectedClient) return;

    setAssigningTemplate(templateId);
    try {
      await api.post(`/clients/${selectedClient}/templates`, { templateId, customName });
      await loadData();
      setShowAssignModal(false);
    } catch (error) {
      console.error('Failed to assign template:', error);
      alert('Failed to assign template. Please try again.');
    } finally {
      setAssigningTemplate(null);
    }
  };

  const handleRemoveTemplate = async (templateId: string) => {
    if (!selectedClient) return;
    if (!confirm('Are you sure you want to remove this template from the client?')) {
      return;
    }

    setRemovingTemplate(templateId);
    try {
      await api.delete(`/clients/${selectedClient}/templates/${templateId}`);
      await loadData();
    } catch (error) {
      console.error('Failed to remove template:', error);
      alert('Failed to remove template. Please try again.');
    } finally {
      setRemovingTemplate(null);
    }
  };

  const handleToggleTemplateStatus = async (templateId: string, isActive: boolean) => {
    if (!selectedClient) return;

    try {
      await api.patch(`/clients/${selectedClient}/templates/${templateId}`, { isActive: !isActive });
      await loadData();
    } catch (error) {
      console.error('Failed to update template status:', error);
      alert('Failed to update template status. Please try again.');
    }
  };

  const getAssignedTemplateIds = () => {
    return new Set(clientTemplates.map(ct => ct.templateId));
  };

  const getAvailableTemplates = () => {
    const assignedIds = getAssignedTemplateIds();
    return allTemplates.filter(template => !assignedIds.has(template.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Template Management"
        description="Assign and manage template access for each client"
      />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
              <div className="text-sm text-gray-500">Total Clients</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Layout className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{allTemplates.length}</div>
              <div className="text-sm text-gray-500">Available Templates</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Check className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{clientTemplates.length}</div>
              <div className="text-sm text-gray-500">Assigned Templates</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Client
          </label>
          <select
            value={selectedClient || ''}
            onChange={(e) => setSelectedClient(e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="secondary"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {!selectedClient ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Client</h3>
          <p className="text-gray-500">
            Choose a client from the dropdown above to manage their template access.
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Assigned Templates for {clients.find(c => c.id === selectedClient)?.companyName}
            </h3>
            <Button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Assign Template
            </Button>
          </div>

          {clientTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates assigned</h3>
              <p className="text-gray-500 mb-4">
                This client doesn't have access to any templates yet.
              </p>
              <Button onClick={() => setShowAssignModal(true)}>
                Assign First Template
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Custom Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientTemplates.map((clientTemplate) => {
                    const template = allTemplates.find(t => t.id === clientTemplate.templateId);
                    return (
                      <tr key={clientTemplate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <Layout className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {template?.name || clientTemplate.templateId}
                              </div>
                              <div className="text-sm text-gray-500">{template?.description || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {clientTemplate.customName || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            clientTemplate.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {clientTemplate.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => handleToggleTemplateStatus(clientTemplate.templateId, clientTemplate.isActive)}
                            >
                              {clientTemplate.isActive ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => handleRemoveTemplate(clientTemplate.templateId)}
                              disabled={removingTemplate === clientTemplate.templateId}
                              className="text-red-600 hover:text-red-700"
                            >
                              {removingTemplate === clientTemplate.templateId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Assign Template</h3>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowAssignModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {getAvailableTemplates().length === 0 ? (
                <div className="text-center py-8">
                  <Layout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">All templates are already assigned to this client.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getAvailableTemplates().map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                      <Button
                        onClick={() => handleAssignTemplate(template.id)}
                        disabled={assigningTemplate === template.id}
                        className="flex items-center gap-2"
                      >
                        {assigningTemplate === template.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Assign
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}