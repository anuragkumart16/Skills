import mongoose, { Schema, Document, Model } from "mongoose";
import { SECTION_TYPES } from "@/lib/types";
import type { SectionType } from "@/lib/types";

// Re-export types for server-side usage convenience
export type { SectionType };
export { SECTION_TYPES };

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface ISection {
  skillId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  content: Record<string, unknown>; // TipTap JSON content
  contentPlainText: string;
  sectionType: SectionType;
  parentSectionId?: mongoose.Types.ObjectId;
  children: mongoose.Types.ObjectId[];
  metadata: {
    lastEditedAt: Date;
    wordCount: number;
    hasCodeSnippets: boolean;
    hasLessons: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ISectionDocument extends ISection, Document {}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const SectionSchema = new Schema<ISectionDocument>(
  {
    skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    content: { type: Schema.Types.Mixed, default: {} },
    contentPlainText: { type: String, default: "" },
    sectionType: {
      type: String,
      enum: SECTION_TYPES,
      default: "custom",
    },
    parentSectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    children: [{ type: Schema.Types.ObjectId, ref: "Section" }],
    metadata: {
      lastEditedAt: { type: Date, default: Date.now },
      wordCount: { type: Number, default: 0 },
      hasCodeSnippets: { type: Boolean, default: false },
      hasLessons: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

SectionSchema.index({ skillId: 1, order: 1 });
SectionSchema.index({ skillId: 1, slug: 1 }, { unique: true });

// ─── Model Export ─────────────────────────────────────────────────────────────

const Section: Model<ISectionDocument> =
  mongoose.models.Section ||
  mongoose.model<ISectionDocument>("Section", SectionSchema);

export default Section;
