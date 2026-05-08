"use client";

import React from "react";
import Header from "@/components/layout/header";
import { GitBranch, Sparkles } from "lucide-react";

export default function GraphPage() {
  return (
    <>
      <Header
        title="Skill Graph"
        subtitle="Visualize your interconnected expertise"
      />
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <GitBranch className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Skill Graph
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-4 leading-relaxed">
          An interactive map of your skills and their connections. Nodes
          represent skills, edges represent relationships, sized by depth.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Coming in Phase 5 — Visualization & Polish</span>
        </div>
      </div>
    </>
  );
}
