"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentStore } from "@/store/useDocumentStore";
import { toast } from "sonner";

interface CreateDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDocModal({ isOpen, onClose }: CreateDocModalProps) {
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { createNewDocument } = useDocumentStore();
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsGenerating(true);
    try {
      // Create document in PostgreSQL via Go API
      const doc = await createNewDocument(title);
      toast.success("Document initialized! Opening workspace...");
      
      onClose();
      setTitle("");
      // Direct route redirect to generated document ID link
      router.push(`/documents/${doc.id}`);
    } catch (err) {
      toast.error("Failed to create document. Ensure Go backend is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto bg-indigo-500/10 p-3 rounded-full border border-indigo-500/20 text-indigo-400 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">Create AI Document</DialogTitle>
          <DialogDescription className="text-center text-slate-400 text-xs">
            Enter a title or prompt. Your document will be generated and saved directly to your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4 mt-2">
          <Input
            placeholder="e.g. System Architecture Design for Payment Gateway"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950 border-slate-800 focus:border-indigo-500 text-slate-200 placeholder:text-slate-600"
            disabled={isGenerating}
            autoFocus
          />

          <Button
            type="submit"
            disabled={isGenerating || !title.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md shadow-indigo-500/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Document...
              </>
            ) : (
              "Generate & Open Document"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}