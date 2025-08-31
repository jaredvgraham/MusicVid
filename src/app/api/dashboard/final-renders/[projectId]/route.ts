import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import FinalRender from "@/backend/models/FinalRender";
import dbConnect from "@/backend/lib/db";
import Utils from "@/utils/utils";
import { getObjectUrl as getS3ObjectUrl } from "@/backend/lib/s3";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    console.error("Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { projectId } = params || ({} as any);
  if (!projectId) {
    console.error("Missing projectId");
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }
  try {
    await dbConnect();
    const finalRenders = await FinalRender.find({ projectId, userId });

    // Ensure URLs are fresh
    const items = await Promise.all(
      finalRenders.map(async (r) => {
        const key = (r as any).renderKey as string | undefined;
        let url = (r as any).renderUrl as string | undefined;
        if (key) {
          try {
            url = await getS3ObjectUrl(key);
          } catch {}
        }
        return {
          _id: (r as any)._id?.toString?.() ?? (r as any)._id,
          projectId: (r as any).projectId,
          renderUrl: url,
          renderKey: (r as any).renderKey,
          createdAt:
            (r as any).createdAt instanceof Date
              ? (r as any).createdAt.toISOString()
              : (r as any).createdAt,
        };
      })
    );

    return NextResponse.json({ finalRenders: items, timestamp: Date.now() }, { status: 200 });
  } catch (error: unknown) {
    const err = Utils.handleApiError(error);
    return NextResponse.json({ error: err }, { status: err.statusCode });
  }
}

