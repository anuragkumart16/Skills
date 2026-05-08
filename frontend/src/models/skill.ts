import mongoose, { Schema, Document, Model } from "mongoose";

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface ISkill {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  tags: string[];
  confidenceLevel: number;
  lastPracticedAt: Date;
  totalMemories: number;
  relatedSkills: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkillDocument extends ISkill, Document {}

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const SkillSchema = new Schema<ISkillDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "📘" },
    color: { type: String, default: "#6366f1" },
    category: { type: String, default: "General" },
    tags: { type: [String], default: [] },
    confidenceLevel: { type: Number, default: 50, min: 0, max: 100 },
    lastPracticedAt: { type: Date, default: Date.now },
    totalMemories: { type: Number, default: 0 },
    relatedSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  },
  {
    timestamps: true,
  }
);

SkillSchema.index({ category: 1 });
SkillSchema.index({ tags: 1 });
SkillSchema.index({ slug: 1 });

// ─── Model Export ─────────────────────────────────────────────────────────────

const Skill: Model<ISkillDocument> =
  mongoose.models.Skill || mongoose.model<ISkillDocument>("Skill", SkillSchema);

export default Skill;
