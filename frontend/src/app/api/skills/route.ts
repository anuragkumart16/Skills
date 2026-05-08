import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skill from "@/models/skill";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── GET /api/skills ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const category = req.nextUrl.searchParams.get("category");
    const filter: Record<string, unknown> = {};
    if (category && category !== "All") {
      filter.category = category;
    }

    const skills = await Skill.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// ─── POST /api/skills ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, description, category, icon, tags, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(name);
    const existing = await Skill.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const skill = await Skill.create({
      name: name.trim(),
      slug,
      description: description || "",
      category: category || "General",
      icon: icon || "📘",
      tags: tags || [],
      color: color || "#6366f1",
    });

    return NextResponse.json(skill.toObject(), { status: 201 });
  } catch (error) {
    console.error("POST /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
