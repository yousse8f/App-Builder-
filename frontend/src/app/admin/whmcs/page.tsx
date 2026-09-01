'use client';

import { useState, useEffect } from 'react';
import { Server, Key, Globe, Database, Shield, Plus, Trash2, Edit, Save, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/shared/ui/PageHeader';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/Button';

interface WHMCSConfig {
  id: string;
  apiUrl: string;
  apiKey: string;
  username: string;
  password: string;
  isActive: boolean;
  lastSync?: string;
  createdAt: string;
}

export default function WHMCSPage() {
  const [configs, setConfigs] = useState<WHMCSConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<WHMCSConfig | null>(null);
  const [formData, setFormData] = useState({
    apiUrl: '',
    apiKey: '',
    username: '',
    password: '',
  });

  const loadConfigs = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockConfigs: WHMCSConfig[] = [
        {
          id: '1',
          apiUrl: 'https://whmcs.example.com/api',
          apiKey: '••••••••••••••••',
          username: 'admin',
          password: '••••••••••••••••',
          isActive: true,
          lastSync: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
      setConfigs(mockConfigs);
    } catch (error) {
      console.error('Failed to load WHMCS configs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleAddConfig = () => {
    setEditingConfig(null);
    setFormData({
      apiUrl: '',
      apiKey: '',
      username: '',
      password: '',
    });
    setShowAddForm(true);
  };

  const handleEditConfig = (config: WHMCSConfig) => {
    setEditingConfig(config);
    setFormData({
      apiUrl: config.apiUrl,
      apiKey: config.apiKey,
      username: config.username,
      password: config.password,
    });
    setShowAddForm(true);
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this WHMCS configuration?')) return;
    
    try {
      // Replace with actual API call
      setConfigs(configs.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete config:', error);
      alert('Failed to delete configuration');
    }
  };

  const handleSaveConfig = async () => {
    try {
      // Replace with actual API call
      if (editingConfig) {
        setConfigs(configs.map(c => 
          c.id === editingConfig.id 
            ? { ...c, ...formData, lastSync: new Date().toISOString() }
            : c
        ));
      } else {
        const newConfig: WHMCSConfig = {
          id: Date.now().toString(),
          ...formData,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setConfigs([...configs, newConfig]);
      }
      setShowAddForm(false);
      setEditingConfig(null);
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('Failed to save configuration');
    }
  };

  const handleTestConnection = async () => {
    try {
      // Replace with actual API call
      alert('Connection test successful!');
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('Connection test failed. Please check your credentials.');
    }
  };

  const handleSync = async () => {
    try {
      // Replace with actual API call
      alert('Sync completed successfully!');
      loadConfigs();
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading WHMCS configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="WHMCS Integration"
        description="Manage WHMCS billing system integration and configurations"
        actions={
          <Button onClick={handleAddConfig}>
            <Plus className="w-4 h-4 mr-2" />
            Add Configuration
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API URL
                </label>
                <input
                  type="url"
                  value={formData.apiUrl}
                  onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://whmcs.example.com/api"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your WHMCS API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="WHMCS admin username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="WHMCS admin password"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveConfig}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingConfig ? 'Update' : 'Save'} Configuration
                </Button>
                <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Configurations List */}
        {configs.length === 0 ? (
          <Card className="p-12 text-center">
            <Server className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No WHMCS Configurations</h3>
            <p className="text-gray-500 mb-6">
              You haven&apos;t configured any WHMCS integrations yet. Add your first configuration to start syncing billing data.
            </p>
            <Button onClick={handleAddConfig}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Configuration
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {configs.map((config) => (
              <Card key={config.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Server className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">WHMCS Configuration</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            config.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {config.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {config.lastSync && (
                            <span className="text-xs text-gray-500">
                              Last sync: {new Date(config.lastSync).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">URL:</span>
                        <span className="text-gray-900 font-medium">{config.apiUrl}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Key className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Username:</span>
                        <span className="text-gray-900 font-medium">{config.username}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleTestConnection()}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleSync()}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Sync
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEditConfig(config)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleDeleteConfig(config.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Information Card */}
        <Card className="p-6 bg-indigo-50 border-indigo-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About WHMCS Integration</h4>
              <p className="text-sm text-gray-600 mb-3">
                WHMCS integration allows you to sync client data, licenses, and billing information between your App Builder platform and WHMCS billing system.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sync client accounts and subscriptions</li>
                <li>• Automate license generation and validation</li>
                <li>• Track billing and payment status</li>
                <li>• Manage product configurations</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}