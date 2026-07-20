"use client";

import { Sparkles, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenAiModal: () => void;
}

export function Header({ onOpenAiModal }: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/30">
          <FileText className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">AI Workspace</h1>
          <p className="text-xs text-slate-400">Document Hub & AI Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onOpenAiModal}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30 gap-2 rounded-lg"
        >
          <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
          Generate with AI
        </Button>

        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}