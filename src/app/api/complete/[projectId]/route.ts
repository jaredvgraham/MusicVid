import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/db";
import Project from "@/backend/models/Project";

export async function GET(_req: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    await dbConnect();

    const { projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json({ completed: false, error: "Missing projectId" }, { status: 400 });
    }

    const doc = await Project.findById(projectId);
    if (!doc) {
      return NextResponse.json({ completed: false, exists: false }, { status: 404 });
    }

    const rawVideo = (doc as any).video as string | undefined;
    const completed = (typeof rawVideo === "string" && rawVideo.trim().length > 0) && (doc as any).transcript;
    const failed = (doc as any).failed === true;

    return NextResponse.json({ completed, failed });
  } catch (e) {
    return NextResponse.json({ completed: false, error: "Internal Server Error" }, { status: 500 });
  }
}