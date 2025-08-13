import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import WorkspaceClient from "@/backend/lib/workspaceClient";
import { UpdateTranscriptResult } from "@/types";

export async function PUT(req: NextRequest, context: { params: any }) {
  const { userId } = await auth();
  if (!userId) {
    console.error("Unauthorized request");
    return NextResponse.json(
      { error: "Unauthorized Request" },
      { status: 401 }
    );
  }
  const projectId = await context.params.id;
  const { transcript } = await req.json();
  const resp: UpdateTranscriptResult = await WorkspaceClient.updateTranscript(
    userId,
    projectId,
    transcript
  );
  if (!resp.ok) {
    console.log(resp.error.message);
    return NextResponse.json(
      { error: resp.error._error },
      { status: resp.error.statusCode }
    );
  }
  return NextResponse.json({ transcript: resp.data }, { status: 200 });
}
