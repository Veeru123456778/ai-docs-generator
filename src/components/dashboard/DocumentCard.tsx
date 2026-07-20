"use client";

import Link from "next/link";
import { FileText, ArrowRight, Trash2, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "../../types";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const formattedDate = new Date(document.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="bg-slate-900/60 border-slate-800/80 hover:border-slate-700 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 group flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onDelete(document.id);
            }}
            className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <CardTitle className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1 mt-3">
          {document.title || "Untitled Document"}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
          <Calendar className="w-3.5 h-3.5" />
          Created {formattedDate}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-2 border-t border-slate-800/50">
        <Link href={`/documents/${document.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-slate-800 bg-slate-950/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-slate-300 text-xs justify-between transition-all"
          >
            Open Document
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}