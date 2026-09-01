import { api } from './client';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  clientId: string;
  screens: ProjectScreen[];
  assets: ProjectAsset[];
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string | null;
}

export interface ProjectScreen {
  id: string;
  name: string;
  order: number;
  config: Record<string, unknown>;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAsset {
  id: string;
  name: string;
  type: string;
  url: string;
  deviceId?: string;
  metadata?: any;
  projectId: string;
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export const projectsApi = {
  getAll: async () => {
    try {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch project:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  create: async (data: CreateProjectRequest) => {
    try {
      const response = await api.post<Project>('/projects', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create project:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  update: async (id: string, data: UpdateProjectRequest) => {
    try {
      const response = await api.patch<Project>(`/projects/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update project:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  addScreen: async (projectId: string, data: { name: string; order: number; config: Record<string, unknown> }) => {
    try {
      const response = await api.post<ProjectScreen>(`/projects/${projectId}/screens`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to add screen:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  updateScreen: async (screenId: string, config: Record<string, unknown>) => {
    try {
      const response = await api.patch<ProjectScreen>(`/projects/screens/${screenId}`, config);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update screen:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  deleteScreen: async (screenId: string) => {
    try {
      const response = await api.delete(`/projects/screens/${screenId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete screen:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },

  removeAsset: async (assetId: string) => {
    try {
      const response = await api.delete(`/projects/assets/${assetId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to remove asset:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Client not found')) {
        error.clientProfileError = true;
      }
      throw error;
    }
  },
};