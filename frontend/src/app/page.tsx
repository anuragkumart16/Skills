"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Brain,
  Zap,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useSkillStore } from "@/stores/skill-store";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 hover:bg-card/80 transition-colors duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Brain className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Welcome to PKOS
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        Your Personal Knowledge Operating System. Start by creating your first
        skill manual to preserve your operational expertise.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/skills?new=true">
          <Button className="gap-2" size="lg">
            <Plus className="w-4 h-4" />
            Create First Skill
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" className="gap-2" size="lg">
            <Sparkles className="w-4 h-4" />
            Explore Search
          </Button>
        </Link>
      </div>

      {/* ── Getting Started Guide ──────────────────────────────────── */}
      <div className="mt-12 w-full max-w-lg">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Getting Started
        </h3>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "Create a Skill Manual",
              desc: "Add your first skill like React, Docker, or Redis",
              icon: BookOpen,
            },
            {
              step: "2",
              title: "Add Sections",
              desc: "Structure your knowledge: setup, workflows, debugging, lessons",
              icon: Target,
            },
            {
              step: "3",
              title: "Capture Memories",
              desc: "Record decisions, mistakes, solutions, and heuristics",
              icon: Brain,
            },
            {
              step: "4",
              title: "Search & Reinforce",
              desc: "Semantically search and revisit stale knowledge",
              icon: Zap,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-4 p-3 rounded-lg bg-surface/50 border border-border/30"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                {item.step}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard with Skills ────────────────────────────────────────────────────

function DashboardContent() {
  const { skills } = useSkillStore();

  const totalSkills = skills.length;
  const totalMemories = skills.reduce((sum, s) => sum + s.totalMemories, 0);
  const avgConfidence = totalSkills > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.confidenceLevel, 0) / totalSkills)
    : 0;

  // Calculate stale skills (not practiced in >30 days)
  const staleSkills = skills.filter((s) => {
    const daysSince = Math.floor(
      (Date.now() - new Date(s.lastPracticedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince > 30;
  });

  return (
    <div className="p-6 space-y-8">
      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Skill Manuals"
          value={totalSkills}
          subtitle="Active knowledge domains"
          icon={BookOpen}
          gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
        />
        <StatCard
          title="Memories"
          value={totalMemories}
          subtitle="Captured experiences"
          icon={Brain}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Avg. Confidence"
          value={`${avgConfidence}%`}
          subtitle="Across all skills"
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          title="Need Review"
          value={staleSkills.length}
          subtitle="Skills becoming stale"
          icon={AlertTriangle}
          gradient="bg-gradient-to-br from-rose-500 to-red-600"
        />
      </div>

      {/* ── Skills Overview ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Your Skills
          </h2>
          <Link href="/skills">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View all
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.slice(0, 6).map((skill) => {
            const daysSince = Math.floor(
              (Date.now() - new Date(skill.lastPracticedAt).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <Link key={skill._id} href={`/skills/${skill.slug}`}>
                <Card className="group border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{skill.icon}</span>
                        <CardTitle className="text-sm font-semibold">
                          {skill.name}
                        </CardTitle>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-normal"
                      >
                        {skill.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {skill.description || "No description yet"}
                    </p>

                    {/* Confidence bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium text-foreground">
                          {skill.confidenceLevel}%
                        </span>
                      </div>
                      <Progress
                        value={skill.confidenceLevel}
                        className="h-1.5"
                      />
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        {skill.totalMemories} memories
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {daysSince === 0
                          ? "Today"
                          : daysSince === 1
                            ? "Yesterday"
                            : `${daysSince}d ago`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Stale Skills Alert ────────────────────────────────────── */}
      {staleSkills.length > 0 && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Knowledge Decay Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              These skills haven&apos;t been practiced recently and may need
              reinforcement:
            </p>
            <div className="flex flex-wrap gap-2">
              {staleSkills.map((skill) => {
                const daysSince = Math.floor(
                  (Date.now() - new Date(skill.lastPracticedAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <Link key={skill._id} href={`/skills/${skill.slug}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-accent transition-colors"
                    >
                      {skill.icon} {skill.name}
                      <span className="ml-1.5 text-warning">{daysSince}d</span>
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { skills } = useSkillStore();

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Your knowledge at a glance"
      />
      {skills.length === 0 ? <EmptyState /> : <DashboardContent />}
    </>
  );
}
