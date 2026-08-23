export interface Client {
  id: string;
  companyName: string;
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  users?: ClientUser[];
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
  clientId: string;
  createdAt: string;
}

export interface CreateClientDto {
  companyName: string;
  name: string;
  email: string;
  password: string;
  status?: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
}

export interface UpdateClientDto {
  companyName?: string;
  status?: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
}

export interface ClientsListResponse {
  clients: Client[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClientFilters {
  search?: string;
  status?: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
  page?: number;
  pageSize?: number;
}