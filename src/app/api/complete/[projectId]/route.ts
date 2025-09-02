import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/db";
import Project from "@/backend/models/Project";

export async function GET(
  _req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    await dbConnect();

    const { projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json(
        { completed: false, error: "Missing projectId" },
        { status: 400 }
      );
    }

    // Use lean() for faster query and only select needed fields
    const doc = await Project.findById(projectId)
      .select("video transcript failed")
      .lean();

    if (!doc) {
      return NextResponse.json(
        { completed: false, exists: false },
        { status: 404 }
      );
    }

    const rawVideo = (doc as any).video as string | undefined;
    const hasVideo = typeof rawVideo === "string" && rawVideo.trim().length > 0;

    const transcript = (doc as any).transcript as unknown;
    const hasTranscript =
      Array.isArray(transcript) &&
      transcript.length > 0 &&
      // Either at least one line has words
      ((transcript as any[]).some(
        (ln) => Array.isArray(ln?.words) && ln.words.length > 0
      ) ||
        // Or at least one line has a valid time span
        (transcript as any[]).some(
          (ln) =>
            typeof ln?.start === "number" &&
            typeof ln?.end === "number" &&
            ln.end > ln.start
        ));

    const completed = hasVideo && hasTranscript;
    const failed = (doc as any).failed === true;

    return NextResponse.json({ completed, failed });
  } catch (e) {
    console.error("Error checking project completion:", e);
    return NextResponse.json(
      { completed: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
