import React from 'react';
import { notFound } from 'next/navigation';

// Interfaces matching your Go backend / OpenAPI spec
interface BlockContent {
  text?: string;
  level?: number;
  language?: string;
  items?: string[];
}

interface Block {
  id: string;
  document_id: string;
  type: 'heading' | 'paragraph' | 'code' | 'list';
  content: BlockContent;
}

interface Document {
  id: string;
  title: string;
  created_at?: string;
}

interface DocumentApiResponse {
  document: Document;
  blocks: Block[];
}

// Data Fetcher: Calls Go backend REST API directly on the Next.js server
async function getDocumentData(id: string): Promise<DocumentApiResponse | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/v1/documents/${id}`, {
      cache: 'no-store', // Ensures fresh data on every page reload
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch document from Go backend:', error);
    return null;
  }
}

// 1. Component to render individual blocks based on type
function DocumentBlockRenderer({ block }: { block: Block }) {
  const { type, content } = block;

  switch (type) {
    case 'heading': {
      const level = content.level || 2;
      if (level === 1) {
        return <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-8 mb-4">{content.text}</h1>;
      }
      if (level === 2) {
        return <h2 className="text-2xl font-bold tracking-tight text-gray-800 mt-6 mb-3 border-b pb-2">{content.text}</h2>;
      }
      return <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{content.text}</h3>;
    }

    case 'paragraph': {
      return (
        <p className="text-gray-700 leading-relaxed my-3 whitespace-pre-line text-base">
          {content.text}
        </p>
      );
    }

    case 'code': {
      return (
        <div className="my-5 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shadow-sm">
          {content.language && (
            <div className="bg-slate-800/80 px-4 py-1.5 text-xs font-mono text-slate-400 border-b border-slate-700/50 flex justify-between items-center">
              <span>{content.language}</span>
            </div>
          )}
          <pre className="p-4 text-sm font-mono text-slate-100 overflow-x-auto leading-normal">
            <code>{content.text}</code>
          </pre>
        </div>
      );
    }

    case 'list': {
      const items = content.items || [];
      return (
        <ul className="my-3 space-y-2 pl-5 list-disc text-gray-700 marker:text-indigo-500">
          {items.map((item, index) => (
            <li key={index} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    default:
      return null;
  }
}

// 2. Next.js Page Component (Entry Point)
export default async function DocumentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params Promise required by Next.js 15+
  const resolvedParams = await params;
  
  // Fetch data from Go backend using the URL parameter
  const data = await getDocumentData(resolvedParams.id);

  if (!data || !data.document) {
    notFound(); // Triggers standard Next.js 404 page if document doesn't exist
  }

  const { document, blocks } = data;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        {/* Document Header */}
        <header className="px-8 pt-8 pb-6 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
            <span>Document</span>
            <span>•</span>
            <span className="font-mono text-slate-400">{document?.id?.substring(0, 8)}...</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {document?.title || 'Untitled Document'}
          </h1>
        </header>

        {/* Document Content Blocks */}
        <article className="p-8 space-y-2">
          {blocks && blocks.length > 0 ? (
            blocks.map((block) => (
              <DocumentBlockRenderer key={block.id} block={block} />
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              This document is empty.
            </div>
          )}
        </article>

      </main>
    </div>
  );
}