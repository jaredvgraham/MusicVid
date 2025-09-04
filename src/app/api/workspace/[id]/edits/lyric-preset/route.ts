import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Project from "@/backend/models/Project";
import Preset from "@/backend/models/Preset";
import dbConnect from "@/backend/lib/db";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  await dbConnect();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized Request" },
      { status: 401 }
    );
  }
  const { id: projectId } = await context.params;
  const { presetData } = await req.json();
  const project = await Project.findById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if ((project as any).user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Update the preset document if it exists
  if (project.lyricPresetId) {
    console.log("Updating preset document:", project.lyricPresetId);
    console.log("New preset data name:", presetData?.name);
    console.log("New preset data", presetData);

    // Check current document before update
    const currentDoc = await Preset.findById(project.lyricPresetId).lean();
    console.log("Current doc lyricPreset name:", currentDoc?.lyricPreset?.name);

    // Try using the collection directly to bypass any validation issues
    const collection = Preset.collection;
    const preset = await Preset.findById(project.lyricPresetId);
    if (preset) {
      preset.lyricPreset = presetData;
      await preset.save();
      console.log("Raw update result:", preset);
    } else {
      console.log("Preset not found");
    }

    // Get the updated document
    const result = await Preset.findById(project.lyricPresetId).lean();

    console.log("Update result:", result ? "success" : "failed");
    console.log("Updated doc lyricPreset name:", result?.lyricPreset?.name);

    // Double-check with a fresh query
    const verifyDoc = await Preset.findById(project.lyricPresetId).lean();
    console.log(
      "Verification doc lyricPreset name:",
      verifyDoc?.lyricPreset?.name
    );
  }

  return NextResponse.json({ ok: true, presetData });
}
