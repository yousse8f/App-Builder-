import { api } from './client';
import { Client, CreateClientDto, UpdateClientDto, ClientsListResponse, ClientFilters } from '@/types/client';

export const clientsApi = {
  getClients: async (filters?: ClientFilters): Promise<ClientsListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const response = await api.get<ClientsListResponse | Client[]>(`/clients?${params.toString()}`);
    const payload = response.data;

    if (Array.isArray(payload)) {
      return {
        clients: payload,
        total: payload.length,
        page: filters?.page ?? 1,
        pageSize: filters?.pageSize ?? (payload.length > 0 ? payload.length : 10),
      };
    }

    return {
      clients: payload?.clients ?? [],
      total: payload?.total ?? payload?.clients?.length ?? 0,
      page: payload?.page ?? filters?.page ?? 1,
      pageSize: payload?.pageSize ?? filters?.pageSize ?? 10,
    };
  },

  getClient: async (id: string): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  createClient: async (data: CreateClientDto): Promise<Client> => {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  },

  updateClient: async (id: string, data: UpdateClientDto): Promise<Client> => {
    const response = await api.patch<Client>(`/clients/${id}`, data);
    return response.data;
  },

  blockClient: async (id: string): Promise<Client> => {
    const response = await api.patch<Client>(`/clients/${id}/block`);
    return response.data;
  },

  unblockClient: async (id: string): Promise<Client> => {
    const response = await api.patch<Client>(`/clients/${id}/unblock`);
    return response.data;
  },
};