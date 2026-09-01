import { api } from './client';

export interface Template {
  id: string;
  name: string;
  description: string;
}

export const templatesApi = {
  getAll: async () => {
    try {
      const response = await api.get<Template[]>('/screenshots/templates');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch templates:', error);
      throw error;
    }
  },
};