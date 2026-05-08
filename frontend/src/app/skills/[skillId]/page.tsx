"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ChevronRight,
  FileText,
  Clock,
  Brain,
  ArrowLeft,
  Edit3,
} from "lucide-react";
import { SECTION_TYPE_META, type SectionType } from "@/models/section";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  tags: string[];
  confidenceLevel: number;
  lastPracticedAt: string;
  totalMemories: number;
}

interface SectionDetail {
  _id: string;
  skillId: string;
  title: string;
  slug: string;
  order: number;
  sectionType: SectionType;
  contentPlainText: string;
  metadata: {
    lastEditedAt: string;
    wordCount: number;
    hasCodeSnippets: boolean;
    hasLessons: boolean;
  };
}

// ─── Create Section Dialog ────────────────────────────────────────────────────

function CreateSectionDialog({
  open,
  onClose,
  skillId,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  skillId: string;
  onCreated: (section: SectionDetail) => void;
}) {
  const [title, setTitle] = useState("");
  const [sectionType, setSectionType] = useState<SectionType>("custom");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId,
          title: title.trim(),
          sectionType,
        }),
      });

      if (res.ok) {
        const section = await res.json();
        onCreated(section);
        setTitle("");
        setSectionType("custom");
        onClose();
      }
    } catch (err) {
      console.error("Failed to create section:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Add Section
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Section Title
            </label>
            <Input
              placeholder="e.g. Authentication, Deployment..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Section Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                Object.entries(SECTION_TYPE_META) as [
                  SectionType,
                  (typeof SECTION_TYPE_META)[SectionType],
                ][]
              ).map(([type, meta]) => (
                <button
                  key={type}
                  onClick={() => setSectionType(type)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-all text-left",
                    sectionType === type
                      ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <span>{meta.icon}</span>
                  <span className="truncate">{meta.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || creating}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            {creating ? "Creating..." : "Add Section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Skill Detail Page ────────────────────────────────────────────────────────

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const { skillId } = use(params);
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [sections, setSections] = useState<SectionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchSkill = useCallback(async () => {
    try {
      const res = await fetch(`/api/skills/${skillId}`);
      if (res.ok) {
        const data = await res.json();
        setSkill(data.skill);
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error("Failed to fetch skill:", err);
    } finally {
      setLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  if (loading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!skill) {
    return (
      <>
        <Header title="Not Found" />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Skill not found</p>
          <Link href="/skills">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Skills
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const daysSince = Math.floor(
    (Date.now() - new Date(skill.lastPracticedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Header title={skill.name} subtitle={skill.description || skill.category}>
        <Button
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </Button>
      </Header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Main Content ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Skill Header Card */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                {skill.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-bold text-foreground">
                    {skill.name}
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    {skill.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {skill.description || "No description added yet. Click to add one."}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <Progress value={skill.confidenceLevel} className="h-2 flex-1" />
                      <span className="text-xs font-medium">{skill.confidenceLevel}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Memories</p>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      {skill.totalMemories}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Practiced</p>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {daysSince === 0
                        ? "Today"
                        : daysSince === 1
                          ? "Yesterday"
                          : `${daysSince} days ago`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section List */}
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sections ({sections.length})
              </h3>
            </div>

            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-border/50">
                <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  No sections yet. Start structuring your knowledge.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Section
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-22rem)]">
                <div className="space-y-1.5">
                  {sections.map((section) => {
                    const meta = SECTION_TYPE_META[section.sectionType] || SECTION_TYPE_META.custom;

                    return (
                      <Link
                        key={section._id}
                        href={`/skills/${skillId}/${section.slug}`}
                      >
                        <div className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-200 cursor-pointer">
                          <span className="text-base flex-shrink-0">{meta.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {section.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {meta.label} · {section.metadata.wordCount} words
                            </p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {/* ── Right Sidebar: Quick Info ────────────────────────────── */}
        <aside className="hidden xl:block w-72 border-l border-border/50 p-4 overflow-y-auto">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Info
          </h4>

          <div className="space-y-4">
            {/* Tags */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1">
                {skill.tags.length > 0 ? (
                  skill.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Section Types Summary */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">
                Section Types
              </p>
              <div className="space-y-1">
                {Object.entries(
                  sections.reduce(
                    (acc, s) => {
                      acc[s.sectionType] = (acc[s.sectionType] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>
                  )
                ).map(([type, count]) => {
                  const meta = SECTION_TYPE_META[type as SectionType];
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span>{meta?.icon}</span>
                        {meta?.label || type}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <CreateSectionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        skillId={skill._id}
        onCreated={(section) => setSections((prev) => [...prev, section])}
      />
    </>
  );
}
