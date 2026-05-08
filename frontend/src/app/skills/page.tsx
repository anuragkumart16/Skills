"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  BookOpen,
  Brain,
  Clock,
  Grid3X3,
  List,
  Filter,
} from "lucide-react";
import { useSkillStore, type SkillData } from "@/stores/skill-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

// ─── Category Colors ──────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "AI/ML",
  "Mobile",
  "General",
];

const SKILL_ICONS = [
  "📘", "⚛️", "🐳", "🗄️", "🐍", "🦀", "☁️", "🔒",
  "📊", "🎨", "⚡", "🧪", "🔧", "🌐", "📱", "🤖",
];

// ─── Create Skill Dialog ──────────────────────────────────────────────────────

function CreateSkillDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addSkill } = useSkillStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [icon, setIcon] = useState("📘");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          category,
          icon,
        }),
      });

      if (res.ok) {
        const skill: SkillData = await res.json();
        addSkill(skill);
        setName("");
        setDescription("");
        setCategory("General");
        setIcon("📘");
        onClose();
      }
    } catch (err) {
      console.error("Failed to create skill:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Create Skill Manual
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Icon Picker */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILL_ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all",
                    icon === ic
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-muted hover:bg-accent"
                  )}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Skill Name
            </label>
            <Input
              placeholder="e.g. React, Docker, Redis..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Description
            </label>
            <Input
              placeholder="Brief overview of this skill..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {cat}
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
            disabled={!name.trim() || creating}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            {creating ? "Creating..." : "Create Skill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Skills Page ──────────────────────────────────────────────────────────────

export default function SkillsPage() {
  const { skills, setSkills, setLoading } = useSkillStore();
  const { activeView, setActiveView } = useUIStore();
  const searchParams = useSearchParams();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Open dialog if ?new=true
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setDialogOpen(true);
    }
  }, [searchParams]);

  // Fetch skills
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setLoading(false);
    }
  }, [setSkills, setLoading]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Filter skills
  const filtered = skills.filter((s) => {
    const matchesCategory =
      activeCategory === "All" || s.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header title="Skill Manuals" subtitle="Your operational knowledge library">
        <Button
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          New Skill
        </Button>
      </Header>

      <div className="p-6 space-y-6">
        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 text-xs"
            />
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveView("grid")}
                className={cn(
                  "p-1.5 transition-colors",
                  activeView === "grid"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={cn(
                  "p-1.5 transition-colors",
                  activeView === "list"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Skills Grid / List ───────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || activeCategory !== "All"
                ? "No skills match your filters"
                : "No skills created yet"}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Skill
            </Button>
          </div>
        ) : activeView === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((skill) => (
              <SkillGridCard key={skill._id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((skill) => (
              <SkillListItem key={skill._id} skill={skill} />
            ))}
          </div>
        )}
      </div>

      <CreateSkillDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

// ─── Skill Grid Card ──────────────────────────────────────────────────────────

function SkillGridCard({ skill }: { skill: SkillData }) {
  const daysSince = Math.floor(
    (Date.now() - new Date(skill.lastPracticedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/skills/${skill.slug}`}>
      <Card className="group h-full border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              {skill.icon}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-semibold truncate">
                {skill.name}
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] mt-0.5">
                {skill.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
            {skill.description || "No description added yet"}
          </p>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">{skill.confidenceLevel}%</span>
            </div>
            <Progress value={skill.confidenceLevel} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {skill.totalMemories}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysSince === 0 ? "Today" : `${daysSince}d`}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Skill List Item ──────────────────────────────────────────────────────────

function SkillListItem({ skill }: { skill: SkillData }) {
  const daysSince = Math.floor(
    (Date.now() - new Date(skill.lastPracticedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/skills/${skill.slug}`}>
      <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-200 cursor-pointer">
        <span className="text-xl">{skill.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {skill.name}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {skill.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {skill.description || "No description"}
          </p>
        </div>
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs font-medium">{skill.confidenceLevel}%</p>
            <p className="text-[10px] text-muted-foreground">Confidence</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium">{skill.totalMemories}</p>
            <p className="text-[10px] text-muted-foreground">Memories</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium">
              {daysSince === 0 ? "Today" : `${daysSince}d`}
            </p>
            <p className="text-[10px] text-muted-foreground">Last used</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
