'use client';

import { useState, useEffect } from 'react';
import { clientsApi } from '@/lib/api/clients';
import { Client, ClientFilters } from '@/types/client';
import { Search, Plus, Eye, AlertCircle } from 'lucide-react';
import Table from '@/components/shared/ui/Table';
import Badge from '@/components/shared/ui/Badge';
import Button from '@/components/shared/Button';
import PageHeader from '@/components/shared/ui/PageHeader';
import Link from 'next/link';

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ClientFilters>({
    page: 1,
    pageSize: 10,
    status: undefined,
    search: '',
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchClients = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await clientsApi.getClients(filters);

        if (!isMounted) {
          return;
        }

        const normalizedClients = response?.clients ?? [];
        setClients(normalizedClients);
        setTotal(response?.total ?? normalizedClients.length ?? 0);
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }

        if (err && typeof err === 'object' && 'response' in err) {
          const error = err as { response?: { data?: { message?: string } } };
          setError(error.response?.data?.message || 'Failed to load clients');
        } else {
          setError('Failed to load clients');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchClients();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleStatusFilter = (status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | undefined) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'BLOCKED':
        return 'danger';
      case 'SUSPENDED':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage your platform clients and their accounts"
        actions={
          <Link href="/admin/clients/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Client
            </Button>
          </Link>
        }
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={!filters.status ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleStatusFilter(undefined)}
          >
            All
          </Button>
          <Button
            variant={filters.status === 'ACTIVE' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleStatusFilter('ACTIVE')}
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'BLOCKED' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleStatusFilter('BLOCKED')}
          >
            Blocked
          </Button>
          <Button
            variant={filters.status === 'SUSPENDED' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleStatusFilter('SUSPENDED')}
          >
            Suspended
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading clients...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : (clients ?? []).length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {filters.search || filters.status 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Get started by creating your first client account.'}
          </p>
        </div>
      ) : (
        <>
          <Table
            headers={['Company Name', 'Status', 'Created Date', 'Actions']}
            className="mb-4"
          >
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/clients/${client.id}`}>
                    <Button variant="secondary" size="small" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((filters.page! - 1) * filters.pageSize!) + 1} to{' '}
              {Math.min(filters.page! * filters.pageSize!, total)} of {total} clients
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page! * filters.pageSize! >= total}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}