import mongoose, { Schema, Document, Model } from "mongoose";
import { MEMORY_TYPES } from "@/lib/types";
import type { MemoryType } from "@/lib/types";

// Re-export types for server-side usage convenience
export type { MemoryType };
export { MEMORY_TYPES };

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface IMemory {
  skillId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  title: string;
  type: MemoryType;
  content: {
    problem: string;
    solution: string;
    context: string;
    why: string;
    codeSnippet?: string;
    language?: string;
  };
  tags: string[];
  project?: string;
  lessons: string[];
  mistakes: string[];
  relatedMemories: mongoose.Types.ObjectId[];
  embedding: number[];
  confidence: number;
  lastReviewedAt: Date;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMemoryDocument extends IMemory, Document {}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const MemorySchema = new Schema<IMemoryDocument>(
  {
    skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true, index: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: MEMORY_TYPES, required: true },
    content: {
      problem: { type: String, default: "" },
      solution: { type: String, default: "" },
      context: { type: String, default: "" },
      why: { type: String, default: "" },
      codeSnippet: { type: String },
      language: { type: String },
    },
    tags: { type: [String], default: [] },
    project: { type: String },
    lessons: { type: [String], default: [] },
    mistakes: { type: [String], default: [] },
    relatedMemories: [{ type: Schema.Types.ObjectId, ref: "Memory" }],
    embedding: { type: [Number], default: [] },
    confidence: { type: Number, default: 50, min: 0, max: 100 },
    lastReviewedAt: { type: Date, default: Date.now },
    reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

MemorySchema.index({ skillId: 1, type: 1 });
MemorySchema.index({ tags: 1 });
MemorySchema.index({ project: 1 });

// ─── Model Export ─────────────────────────────────────────────────────────────

const Memory: Model<IMemoryDocument> =
  mongoose.models.Memory ||
  mongoose.model<IMemoryDocument>("Memory", MemorySchema);

export default Memory;
