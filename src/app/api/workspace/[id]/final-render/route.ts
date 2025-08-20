import dbConnect from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { params } = await context;
    await dbConnect();

    const resolvedParams = await params;
    const project = await Project.findOne({
      _id: resolvedParams.id,
      userId: userId,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: project._id,
      finalRender: project.finalRender,
      isComplete: !!project.finalRender,
    });
  } catch (error: any) {
    console.error("Error checking final render status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
