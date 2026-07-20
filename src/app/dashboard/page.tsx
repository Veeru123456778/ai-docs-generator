"use client";

import { useEffect, useState } from "react";
import { Plus, FileCode, Sparkles } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { CreateDocModal } from "@/components/dashboard/CreateDocModal";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Document } from "@/types";
import { toast } from "sonner";

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments("usr_123");
      setDocuments(data || []);
    } catch (err) {
      toast.error("Could not load documents from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDeleteDoc = async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success("Document deleted");
    } catch (err) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenAiModal={() => setIsAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Your Documents</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select an existing document or create a new one using AI.
            </p>
          </div>
          <Button
            onClick={() => setIsAiModalOpen(true)}
            variant="outline"
            className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs gap-2"
          >
            <Plus className="w-4 h-4" />
            New Blank Doc
          </Button>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-xl bg-slate-900/40 border border-slate-800/60 animate-pulse" />
            ))}
          </div>
        ) : documents.length > 0 ? (
          /* Document Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onDelete={handleDeleteDoc} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 text-center">
            <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-4">
              <FileCode className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">No documents found</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
              You haven't generated any AI documents yet. Click below to start building your first document.
            </p>
            <Button
              onClick={() => setIsAiModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 text-xs"
            >
              <Sparkles className="w-4 h-4" />
              Create First Document
            </Button>
          </div>
        )}
      </main>

      <CreateDocModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
}