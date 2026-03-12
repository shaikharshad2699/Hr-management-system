import { apiClient } from './api';
import { GeneratedDocument } from '@/types';
import { STORAGE_KEYS } from '@/constants';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

type DocumentEventHandler = (document: GeneratedDocument) => void;
type DocumentDeleteHandler = (id: string) => void;
type SnapshotHandler = (documents: GeneratedDocument[]) => void;

export const documentService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<GeneratedDocument[]>>('/documents');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GeneratedDocument>>(`/documents/${id}`);
    return response.data.data;
  },

  create: async (document: { employeeId: string; documentType: string }) => {
    const response = await apiClient.post<ApiResponse<GeneratedDocument>>('/documents', document);
    return response.data.data;
  },

  update: async (id: string, document: Partial<GeneratedDocument>) => {
    const response = await apiClient.put<ApiResponse<GeneratedDocument>>(`/documents/${id}`, document);
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/documents/${id}`);
  },

  subscribe: (handlers: {
    onSnapshot?: SnapshotHandler;
    onUpsert?: DocumentEventHandler;
    onDelete?: DocumentDeleteHandler;
  }) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const baseUrl = apiClient.defaults.baseURL?.replace(/\/$/, '') ?? '';
    const streamUrl = new URL(`${baseUrl}/documents/stream`);

    if (token) {
      streamUrl.searchParams.set('token', token);
    }

    const eventSource = new EventSource(streamUrl.toString());

    if (handlers.onSnapshot) {
      eventSource.addEventListener('document:snapshot', (event) => {
        handlers.onSnapshot?.(JSON.parse(event.data) as GeneratedDocument[]);
      });
    }

    if (handlers.onUpsert) {
      eventSource.addEventListener('document:upsert', (event) => {
        handlers.onUpsert?.(JSON.parse(event.data) as GeneratedDocument);
      });
    }

    if (handlers.onDelete) {
      eventSource.addEventListener('document:delete', (event) => {
        const payload = JSON.parse(event.data) as { id: string };
        handlers.onDelete?.(payload.id);
      });
    }

    return eventSource;
  },
};
