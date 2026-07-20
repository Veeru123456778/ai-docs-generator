import axios from 'axios';
import { 
  Document, 
  DocumentWithBlocksResponse, 
  CreateDocumentRequest, 
  CreateBlockRequest, 
  UpdateBlockRequest,
  Block
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Fetch all documents for user dashboard
  getDocuments: async (userId: string = 'usr_123'): Promise<Document[]> => {
    const response = await apiClient.get<Document[]>(`/documents?user_id=${userId}`);
    return response.data;
  },

  // Get full document with blocks
  getDocumentById: async (id: string): Promise<DocumentWithBlocksResponse> => {
    const response = await apiClient.get<DocumentWithBlocksResponse>(`/documents/${id}`);
    return response.data;
  },

  // Create new document
  createDocument: async (data: CreateDocumentRequest): Promise<Document> => {
    const response = await apiClient.post<Document>('/documents', data);
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Add block to document
  createBlock: async (data: CreateBlockRequest): Promise<Block> => {
    const response = await apiClient.post<Block>('/blocks', data);
    return response.data;
  },

  // Update existing block (Optimistic concurrency version check)
  updateBlock: async (id: string, data: UpdateBlockRequest): Promise<Block> => {
    const response = await apiClient.put<Block>(`/blocks/${id}`, data);
    return response.data;
  },

  // Delete single block
  deleteBlock: async (id: string): Promise<void> => {
    await apiClient.delete(`/blocks/${id}`);
  }
};