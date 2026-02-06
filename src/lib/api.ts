import axios from 'axios';
import type { Project, UploadResult, QueryResult } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Projects API
export const projectsApi = {
  create: async (name: string): Promise<Project> => {
    const { data } = await api.post('/projects', { name });
    return data;
  },

  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data;
  },

  getOne: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  update: async (id: string, name: string): Promise<Project> => {
    const { data } = await api.patch(`/projects/${id}`, { name });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Upload API
export const uploadApi = {
  uploadFile: async (projectId: string, file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  deleteTable: async (projectId: string, tableName: string): Promise<void> => {
    await api.delete(`/upload/${projectId}/${tableName}`);
  },
};

// Agent API
export const agentApi = {
  query: async (projectId: string, question: string): Promise<QueryResult> => {
    const { data } = await api.post('/agent/query', { projectId, question });
    return data.data;
  },

  previewTable: async (
    projectId: string,
    tableName: string,
    limit = 10
  ): Promise<Record<string, unknown>[]> => {
    const { data } = await api.get(
      `/agent/preview/${projectId}/${tableName}?limit=${limit}`
    );
    return data.data;
  },
};

export default api;
