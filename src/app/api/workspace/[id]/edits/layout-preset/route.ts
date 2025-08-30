import dbConnect from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
  const { presetId } = await req.json();
  console.log("presetId", presetId);
  const project = await Project.findById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  project.layoutPresetId = presetId;
  await project.save();
  return NextResponse.json({ success: true });
}
