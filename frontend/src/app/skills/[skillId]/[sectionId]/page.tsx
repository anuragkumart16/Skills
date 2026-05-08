"use client";

import React, { useState, useEffect, useCallback, use, useRef } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Clock,
  Eye,
  Edit3,
  Check,
} from "lucide-react";
import { SECTION_TYPE_META, type SectionType } from "@/models/section";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionFull {
  _id: string;
  skillId: string;
  title: string;
  slug: string;
  order: number;
  sectionType: SectionType;
  content: Record<string, unknown>;
  contentPlainText: string;
  metadata: {
    lastEditedAt: string;
    wordCount: number;
    hasCodeSnippets: boolean;
    hasLessons: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Section Detail Page ──────────────────────────────────────────────────────

export default function SectionDetailPage({
  params,
}: {
  params: Promise<{ skillId: string; sectionId: string }>;
}) {
  const { skillId, sectionId } = use(params);
  const [section, setSection] = useState<SectionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch section data
  const fetchSection = useCallback(async () => {
    try {
      // First get the skill to find sections
      const res = await fetch(`/api/skills/${skillId}`);
      if (res.ok) {
        const data = await res.json();
        const sec = data.sections?.find(
          (s: SectionFull) => s.slug === sectionId || s._id === sectionId
        );
        if (sec) {
          setSection(sec);
          setContent(sec.contentPlainText || "");
        }
      }
    } catch (err) {
      console.error("Failed to fetch section:", err);
    } finally {
      setLoading(false);
    }
  }, [skillId, sectionId]);

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, editing]);

  // Save content
  const handleSave = async () => {
    if (!section) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/sections?id=${section._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentPlainText: content,
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: content
                  ? [{ type: "text", text: content }]
                  : [],
              },
            ],
          },
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSection(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setEditing(false);
      }
    } catch (err) {
      console.error("Failed to save section:", err);
    } finally {
      setSaving(false);
    }
  };

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

  if (!section) {
    return (
      <>
        <Header title="Not Found" />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Section not found</p>
          <Link href={`/skills/${skillId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Skill
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const meta = SECTION_TYPE_META[section.sectionType] || SECTION_TYPE_META.custom;

  return (
    <>
      <Header
        title={section.title}
        subtitle={`${meta.label} · ${section.metadata.wordCount} words`}
      >
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-success animate-in fade-in duration-300">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          {editing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setContent(section.contentPlainText || "");
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-1.5 text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-1.5 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
        </div>
      </Header>

      <div className="flex-1 overflow-y-auto">
        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <div className="px-6 py-3 border-b border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href="/skills"
              className="hover:text-foreground transition-colors"
            >
              Skills
            </Link>
            <span>/</span>
            <Link
              href={`/skills/${skillId}`}
              className="hover:text-foreground transition-colors"
            >
              {skillId}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{section.title}</span>
          </div>
        </div>

        {/* ── Content Area ────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Section Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{meta.icon}</span>
              <h1 className="text-xl font-bold text-foreground">
                {section.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                {meta.label}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last edited{" "}
                {new Date(section.metadata.lastEditedAt).toLocaleDateString()}
              </span>
              <span>{section.metadata.wordCount} words</span>
            </div>
          </div>

          {/* Editor / Viewer */}
          <div
            className={cn(
              "rounded-xl border transition-all duration-200",
              editing
                ? "border-primary/30 bg-card/80"
                : "border-border/30 bg-card/30"
            )}
          >
            {editing ? (
              <div className="p-6">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your knowledge here...

You can document:
• Setup procedures and configurations
• Architectural decisions and reasoning
• Debugging experiences and solutions
• Deployment workflows
• Lessons learned and heuristics
• Code snippets and patterns"
                  className="w-full min-h-[400px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none leading-relaxed font-mono"
                  autoFocus
                />
              </div>
            ) : (
              <div className="p-6">
                {content ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-sans">
                      {content}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Eye className="w-10 h-10 text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      This section is empty
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Start Writing
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
