import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken, user } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('token', accessToken); // For backward compatibility

          // Update user in auth context if available
          if (user && typeof window !== 'undefined') {
            // Store clientId for template filtering
            if (user.client?.id) {
              localStorage.setItem('clientId', user.client.id);
            }
            window.dispatchEvent(new CustomEvent('auth:user-updated', { detail: user }));
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        localStorage.removeItem('clientId');
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 400 errors for missing client profile
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad request';
      if (errorMessage.includes('Client not found') || errorMessage.includes('client profile')) {
        console.error('Client profile error:', errorMessage);
        // You could redirect to a profile setup page here
        if (typeof window !== 'undefined') {
          // Show user-friendly message
          error.clientProfileError = true;
          error.userMessage = 'Your account needs a client profile. Please contact support or complete your registration.';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: (data: { name: string; email: string; password: string; companyName?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  refresh: (data: { refreshToken: string }) =>
    api.post('/auth/refresh', data),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get('/auth/me'),

  updateProfile: (data: { name?: string; companyName?: string; phone?: string; language?: string; avatar?: string }) =>
    api.patch('/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/auth/password', data),

  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),

  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
};

export const pluginsApi = {
  getAll: () => api.get('/plugins'),
  getById: (id: string) => api.get(`/plugins/${id}`),
  create: (data: Record<string, unknown>) => api.post('/plugins', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/plugins/${id}`, data),
  remove: (id: string) => api.delete(`/plugins/${id}`),
  activate: (id: string) => api.post(`/plugins/${id}/activate`),
  deactivate: (id: string) => api.post(`/plugins/${id}/deactivate`),
};

// Clients API functions
export const clientsApi = {
  getAll: () =>
    api.get('/clients'),

  getById: (id: string) =>
    api.get(`/clients/${id}`),

  create: (data: { companyName: string; userId?: string }) =>
    api.post('/clients', data),

  update: (id: string, data: { companyName?: string; status?: string }) =>
    api.patch(`/clients/${id}`, data),

  block: (id: string) =>
    api.patch(`/clients/${id}/block`),

  unblock: (id: string) =>
    api.patch(`/clients/${id}/unblock`),

  suspend: (id: string) =>
    api.patch(`/clients/${id}/suspend`),

  unsuspend: (id: string) =>
    api.patch(`/clients/${id}/unsuspend`),

  delete: (id: string) =>
    api.delete(`/clients/${id}`),
};

export { api as axiosClient };