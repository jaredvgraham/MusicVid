import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Project from "@/backend/models/Project";
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
  const { presetId } = await req.json();
  const project = await Project.findById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if ((project as any).user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  (project as any).lyricPresetId = presetId;
  await project.save();
  return NextResponse.json({ ok: true, presetId });
}
