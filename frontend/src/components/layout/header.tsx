"use client";

import { Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function Header({ title, subtitle, children }: HeaderProps) {
  const { setCommandPaletteOpen } = useUIStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* ── Left: Title ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {title && (
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Search + Actions ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 h-8"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search knowledge...</span>
          <kbd className="ml-2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-8 w-8 text-muted-foreground"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="w-4 h-4" />
        </Button>
        {children}
      </div>
    </header>
  );
}
