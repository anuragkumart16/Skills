import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skill from "@/models/skill";
import Section from "@/models/section";

// ─── GET /api/skills/[skillId] ────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    await connectDB();
    const { skillId } = await params;

    // Try finding by slug first, then by _id
    let skill = await Skill.findOne({ slug: skillId }).lean();
    if (!skill) {
      skill = await Skill.findById(skillId).lean();
    }

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Fetch sections for this skill
    const sections = await Section.find({ skillId: skill._id })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ skill, sections });
  } catch (error) {
    console.error("GET /api/skills/[skillId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/skills/[skillId] ────────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    await connectDB();
    const { skillId } = await params;
    const body = await req.json();

    const skill = await Skill.findByIdAndUpdate(
      skillId,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("PUT /api/skills/[skillId] error:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/skills/[skillId] ─────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    await connectDB();
    const { skillId } = await params;

    const skill = await Skill.findByIdAndDelete(skillId);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Cascade delete sections
    await Section.deleteMany({ skillId: skill._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/skills/[skillId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
