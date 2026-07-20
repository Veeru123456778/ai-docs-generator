// ==========================================
// Core Domain Entities
// ==========================================

export interface Document {
    id: string;
    user_id: string;
    title: string;
    block_order: string[];
    created_at: string;
    updated_at: string;
  }
  
  export interface BlockContent {
    type: 'header' | 'paragraph' | 'code' | 'ai_prompt';
    text?: string;
    level?: number;
    language?: string;
    [key: string]: any;
  }
  
  export interface Block {
    id: string;
    document_id: string;
    version: number;
    content: BlockContent;
    created_at: string;
    updated_at: string;
  }
  
  // ==========================================
  // API DTOs (Data Transfer Objects)
  // ==========================================
  
  export interface DocumentWithBlocksResponse {
    document: Document;
    blocks: Block[];
  }
  
  export interface CreateDocumentRequest {
    user_id: string;
    title: string;
  }
  
  export interface CreateBlockRequest {
    document_id: string;
    content: BlockContent;
  }
  
  export interface UpdateBlockRequest {
    version: number;
    content: BlockContent;
  }