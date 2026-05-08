// ─── Section Types (shared between client and server) ─────────────────────────

export const SECTION_TYPES = [
  "setup",
  "workflow",
  "architecture",
  "debugging",
  "deployment",
  "optimization",
  "lessons",
  "snippets",
  "mistakes",
  "heuristics",
  "integration",
  "custom",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_TYPE_META: Record<
  SectionType,
  { label: string; icon: string; description: string }
> = {
  setup: { label: "Project Setup", icon: "🔧", description: "Getting started and configuration" },
  workflow: { label: "Workflows", icon: "🔄", description: "Standard operating procedures" },
  architecture: { label: "Architecture", icon: "🏗️", description: "Design decisions and patterns" },
  debugging: { label: "Debugging", icon: "🐛", description: "Common bugs and fixes" },
  deployment: { label: "Deployment", icon: "🚀", description: "Deployment procedures" },
  optimization: { label: "Optimization", icon: "⚡", description: "Performance improvements" },
  lessons: { label: "Lessons Learned", icon: "💡", description: "Key takeaways and insights" },
  snippets: { label: "Code Snippets", icon: "📋", description: "Reusable code patterns" },
  mistakes: { label: "Mistakes", icon: "⚠️", description: "Previous failures and fixes" },
  heuristics: { label: "Heuristics", icon: "🧠", description: "Decision-making rules" },
  integration: { label: "Integration", icon: "🔗", description: "Integration patterns" },
  custom: { label: "Custom", icon: "📝", description: "User-defined section" },
};

// ─── Memory Types (shared between client and server) ──────────────────────────

export const MEMORY_TYPES = [
  "debugging",
  "architecture_decision",
  "workflow",
  "implementation",
  "deployment",
  "code_snippet",
  "mistake",
  "performance",
  "lesson",
  "heuristic",
  "pattern",
] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];

export const MEMORY_TYPE_META: Record<
  MemoryType,
  { label: string; icon: string; color: string }
> = {
  debugging: { label: "Debugging", icon: "🐛", color: "#ef4444" },
  architecture_decision: { label: "Architecture Decision", icon: "🏗️", color: "#8b5cf6" },
  workflow: { label: "Workflow", icon: "🔄", color: "#3b82f6" },
  implementation: { label: "Implementation", icon: "⚙️", color: "#6366f1" },
  deployment: { label: "Deployment", icon: "🚀", color: "#06b6d4" },
  code_snippet: { label: "Code Snippet", icon: "📋", color: "#22c55e" },
  mistake: { label: "Mistake", icon: "⚠️", color: "#f59e0b" },
  performance: { label: "Performance", icon: "⚡", color: "#eab308" },
  lesson: { label: "Lesson", icon: "💡", color: "#a855f7" },
  heuristic: { label: "Heuristic", icon: "🧠", color: "#ec4899" },
  pattern: { label: "Pattern", icon: "🔗", color: "#14b8a6" },
};
