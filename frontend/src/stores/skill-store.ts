import { create } from "zustand";

// ─── Client-side skill type (serialized from MongoDB) ─────────────────────────

export interface SkillData {
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
  createdAt: string;
  updatedAt: string;
}

export interface SectionData {
  _id: string;
  skillId: string;
  title: string;
  slug: string;
  order: number;
  sectionType: string;
  contentPlainText: string;
  metadata: {
    lastEditedAt: string;
    wordCount: number;
    hasCodeSnippets: boolean;
    hasLessons: boolean;
  };
  children: string[];
  createdAt: string;
  updatedAt: string;
}

interface SkillStore {
  skills: SkillData[];
  currentSkill: SkillData | null;
  sections: SectionData[];
  loading: boolean;
  error: string | null;

  // Actions
  setSkills: (skills: SkillData[]) => void;
  setCurrentSkill: (skill: SkillData | null) => void;
  setSections: (sections: SectionData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addSkill: (skill: SkillData) => void;
  updateSkill: (id: string, updates: Partial<SkillData>) => void;
  removeSkill: (id: string) => void;
}

export const useSkillStore = create<SkillStore>((set) => ({
  skills: [],
  currentSkill: null,
  sections: [],
  loading: false,
  error: null,

  setSkills: (skills) => set({ skills }),
  setCurrentSkill: (skill) => set({ currentSkill: skill }),
  setSections: (sections) => set({ sections }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addSkill: (skill) =>
    set((state) => ({ skills: [...state.skills, skill] })),
  updateSkill: (id, updates) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s._id === id ? { ...s, ...updates } : s
      ),
    })),
  removeSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((s) => s._id !== id),
    })),
}));
