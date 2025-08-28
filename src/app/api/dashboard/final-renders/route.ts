import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/backend/models/User";
import Utils from "@/utils/utils";
import Project from "@/backend/models/Project";
import dbConnect from "@/backend/lib/db";
import { getObjectUrl as getS3ObjectUrl } from "@/backend/lib/s3";
import FinalRender from "@/backend/models/FinalRender";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  try {
    await dbConnect();
    if (!userId) {
      console.error("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const finalRenders = await FinalRender.find({
      userId: userId,
    });

    // Refresh S3 URLs for each final render
    const keys = finalRenders.map((render) => render.renderKey);
    const presignedUrls = await Promise.all(
      keys.map(async (key) => {
        console.log("key", key);
        if (key) {
          return await getS3ObjectUrl(key);
        }
        return null;
      })
    );
    const response = NextResponse.json(
      { urls: presignedUrls, timestamp: Date.now() },
      { status: 200 }
    );

    return response;
  } catch (error: unknown) {
    const err = Utils.handleApiError(error);
    return NextResponse.json({ error: err }, { status: err.statusCode });
  }
}
