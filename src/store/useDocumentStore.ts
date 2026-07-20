import { create } from 'zustand';
import { Document, Block, BlockContent } from '@/types';
import { api } from '@/services/api';

interface DocumentState {
  currentDocument: Document | null;
  blocks: Record<string, Block>; // ID to Block mapping
  blockOrder: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  fetchDocument: (id: string) => Promise<void>;
  createNewDocument: (title: string, userId?: string) => Promise<Document>;
  updateBlockContent: (blockId: string, newContent: BlockContent) => Promise<void>;
  addBlock: (type: 'header' | 'paragraph' | 'code', defaultText?: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  currentDocument: null,
  blocks: {},
  blockOrder: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getDocumentById(id);
      
      const blocksMap: Record<string, Block> = {};
      (data.blocks || []).forEach((block) => {
        blocksMap[block.id] = block;
      });

      set({
        currentDocument: data.document,
        blocks: blocksMap,
        blockOrder: data.document?.block_order || [],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to fetch document', isLoading: false });
    }
  },

  createNewDocument: async (title: string, userId: string = 'usr_123') => {
    set({ isSaving: true });
    try {
      const newDoc = await api.createDocument({ title, user_id: userId });
      set({ isSaving: false });
      return newDoc;
    } catch (err: any) {
      set({ isSaving: false });
      throw err;
    }
  },

  updateBlockContent: async (blockId: string, newContent: BlockContent) => {
    const { blocks } = get();
    const targetBlock = blocks[blockId];
    if (!targetBlock) return;

    // Optimistic UI Update
    const updatedBlock: Block = {
      ...targetBlock,
      content: newContent,
      version: targetBlock.version + 1,
    };

    set({
      blocks: { ...blocks, [blockId]: updatedBlock },
      isSaving: true,
    });

    try {
      await api.updateBlock(blockId, {
        version: targetBlock.version, // Pass current version for concurrency check
        content: newContent,
      });
      set({ isSaving: false });
    } catch (err) {
      // Revert optimistic update on version conflict or network error
      set({
        blocks: { ...blocks, [blockId]: targetBlock },
        isSaving: false,
        error: 'Concurrency conflict: Changes reverted. Please refresh.',
      });
    }
  },

  addBlock: async (type, defaultText = '') => {
    const { currentDocument, blockOrder, blocks } = get();
    if (!currentDocument) return;

    set({ isSaving: true });
    try {
      const newBlock = await api.createBlock({
        document_id: currentDocument.id,
        content: { type, text: defaultText },
      });

      set({
        blocks: { ...blocks, [newBlock.id]: newBlock },
        blockOrder: [...blockOrder, newBlock.id],
        isSaving: false,
      });
    } catch (err: any) {
      set({ isSaving: false, error: 'Failed to add block' });
    }
  },
}));