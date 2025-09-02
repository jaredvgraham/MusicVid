import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import WorkspaceClient from "@/backend/lib/workspaceClient";
import { UpdateTranscriptResult } from "@/types";
import dbConnect from "@/backend/lib/db";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  await dbConnect();
  if (!userId) {
    console.error("Unauthorized request");
    return NextResponse.json(
      { error: "Unauthorized Request" },
      { status: 401 }
    );
  }
  const { id: projectId } = await context.params;
  const { transcript } = await req.json();
  const resp: UpdateTranscriptResult = await WorkspaceClient.updateTranscript(
    userId,
    projectId,
    transcript
  );
  if (!resp.ok) {
    return NextResponse.json(
      { error: resp.error._error },
      { status: resp.error.statusCode }
    );
  }
  return NextResponse.json({ transcript: resp.data }, { status: 200 });
}
