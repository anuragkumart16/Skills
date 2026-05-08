"use client";

import Sidebar from "@/components/layout/sidebar";
import CommandPalette from "@/components/layout/command-palette";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <CommandPalette />
      <main
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-[280px]" : "ml-[60px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
