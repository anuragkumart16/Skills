"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Search,
  GitBranch,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Brain,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/stores/ui-store";
import { useSkillStore, type SkillData } from "@/stores/skill-store";
import { cn } from "@/lib/utils";

// ─── Navigation Items ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/skills", label: "Skill Manuals", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/graph", label: "Skill Graph", icon: GitBranch },
];

// ─── Skill Item ───────────────────────────────────────────────────────────────

function SkillItem({ skill }: { skill: SkillData }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(`/skills/${skill.slug}`);

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      <span className="text-base flex-shrink-0">{skill.icon}</span>
      <span className="truncate flex-1">{skill.name}</span>
      <span
        className={cn(
          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
          skill.confidenceLevel >= 70
            ? "bg-success/15 text-success"
            : skill.confidenceLevel >= 40
              ? "bg-warning/15 text-warning"
              : "bg-destructive/15 text-destructive"
        )}
      >
        {skill.confidenceLevel}%
      </span>
    </Link>
  );
}

// ─── Sidebar Component ────────────────────────────────────────────────────────

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { skills } = useSkillStore();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-[280px]" : "w-[60px]"
      )}
    >
      {/* ── Logo ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        {sidebarOpen && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-foreground tracking-tight">
              PKOS
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Knowledge OS
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="flex flex-col gap-1 px-2 py-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
        })}
      </nav>

      <Separator className="mx-2" />

      {/* ── Skills List ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            Skills
          </span>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href="/skills?new=true">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={4}>
              New Skill
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-0.5 pb-4">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <SkillItem key={skill._id} skill={skill} />
            ))
          ) : sidebarOpen ? (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-muted-foreground mb-3">
                No skills yet
              </p>
              <Link href="/skills?new=true">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="w-3 h-3 mr-1.5" />
                  Create your first skill
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </ScrollArea>

      {/* ── Collapse Toggle ─────────────────────────────────────────── */}
      <div className="border-t border-sidebar-border p-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
