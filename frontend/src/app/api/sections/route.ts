import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Section from "@/models/section";
import Skill from "@/models/skill";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── GET /api/sections?skillId=xxx ────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const skillId = req.nextUrl.searchParams.get("skillId");
    if (!skillId) {
      return NextResponse.json(
        { error: "skillId query parameter is required" },
        { status: 400 }
      );
    }

    const sections = await Section.find({ skillId })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json(sections);
  } catch (error) {
    console.error("GET /api/sections error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

// ─── POST /api/sections ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { skillId, title, sectionType, content, parentSectionId } = body;

    if (!skillId || !title) {
      return NextResponse.json(
        { error: "skillId and title are required" },
        { status: 400 }
      );
    }

    // Verify skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Calculate order (append at end)
    const lastSection = await Section.findOne({ skillId })
      .sort({ order: -1 })
      .select("order")
      .lean();
    const order = lastSection ? lastSection.order + 1 : 0;

    // Generate slug unique within the skill
    let slug = slugify(title);
    const existing = await Section.findOne({ skillId, slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const section = await Section.create({
      skillId,
      title: title.trim(),
      slug,
      order,
      sectionType: sectionType || "custom",
      content: content || {},
      parentSectionId,
      metadata: {
        lastEditedAt: new Date(),
        wordCount: 0,
        hasCodeSnippets: false,
        hasLessons: false,
      },
    });

    return NextResponse.json(section.toObject(), { status: 201 });
  } catch (error) {
    console.error("POST /api/sections error:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/sections?id=xxx ─────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "id query parameter is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // If content is being updated, extract metadata
    if (body.content) {
      const plainText = extractPlainText(body.content);
      body.contentPlainText = plainText;
      body["metadata.lastEditedAt"] = new Date();
      body["metadata.wordCount"] = plainText.split(/\s+/).filter(Boolean).length;
    }

    const section = await Section.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("PUT /api/sections error:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/sections?id=xxx ──────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "id query parameter is required" },
        { status: 400 }
      );
    }

    const section = await Section.findByIdAndDelete(id);
    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/sections error:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}

// ─── Helper: Extract plain text from TipTap JSON ─────────────────────────────

function extractPlainText(content: Record<string, unknown>): string {
  if (!content || typeof content !== "object") return "";

  const texts: string[] = [];

  function walk(node: Record<string, unknown>) {
    if (node.text && typeof node.text === "string") {
      texts.push(node.text);
    }
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        walk(child as Record<string, unknown>);
      }
    }
  }

  walk(content);
  return texts.join(" ");
}
