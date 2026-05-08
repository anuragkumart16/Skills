"use client";

import React from "react";
import Header from "@/components/layout/header";
import { Search, Sparkles } from "lucide-react";

export default function SearchPage() {
  return (
    <>
      <Header
        title="Semantic Search"
        subtitle="Search across your entire knowledge base"
      />
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Semantic Search
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-4 leading-relaxed">
          Search your memories using natural language. This feature uses
          AI-powered embeddings to find contextually relevant knowledge.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Coming in Phase 3 — Intelligence Layer</span>
        </div>
      </div>
    </>
  );
}
