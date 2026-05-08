"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  BookOpen,
  Search,
  GitBranch,
  Home,
  Plus,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useSkillStore } from "@/stores/skill-store";

export default function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { skills } = useSkillStore();

  // ── ⌘K Keyboard Shortcut ────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    },
    [commandPaletteOpen, setCommandPaletteOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const navigate = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search skills, memories, or navigate..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigate("/skills")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Skill Manuals
          </CommandItem>
          <CommandItem onSelect={() => navigate("/search")}>
            <Search className="mr-2 h-4 w-4" />
            Semantic Search
          </CommandItem>
          <CommandItem onSelect={() => navigate("/graph")}>
            <GitBranch className="mr-2 h-4 w-4" />
            Skill Graph
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => navigate("/skills?new=true")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Skill
          </CommandItem>
        </CommandGroup>

        {skills.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Skills">
              {skills.map((skill) => (
                <CommandItem
                  key={skill._id}
                  onSelect={() => navigate(`/skills/${skill.slug}`)}
                >
                  <span className="mr-2 text-sm">{skill.icon}</span>
                  {skill.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {skill.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
