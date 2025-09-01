import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ApiError } from "@/types/ApiError";
import ProjectClient from "@/backend/lib/projectClient";
import { getObjectUrl as getS3ObjectUrl } from "@/backend/lib/s3";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check if the current user is authenticated
    const { userId } = await auth();
    if (!userId) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be logged in to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be logged in to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      const error: ApiError = {
        _error: "Bad Request",
        message: "Project ID is required",
        statusCode: 400,
      };
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log("getWorkspace for project:", id);

    // Get the project using ProjectClient
    const result = await ProjectClient.getProject(id);

    if ("_error" in result) {
      // Handle error from ProjectClient
      const status = result.statusCode ?? 500;
      return NextResponse.json({ error: result }, { status });
    }

    const project = result;

    if (
      user.id !== project.user_id &&
      user.primaryEmailAddress?.emailAddress !==
        process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If we have a stored videoKey, get a fresh S3 URL
    let videoUrl = project.video || "";
    if (project.videoKey) {
      try {
        videoUrl = await getS3ObjectUrl(project.videoKey);
      } catch (error) {
        console.warn("Failed to get S3 URL for videoKey:", project.videoKey);
      }
    }
    console.log("project", project);
    console.log("project width:", project.width);
    console.log("project height:", project.height);

    return NextResponse.json({
      project: {
        id: project._id,
        video: videoUrl,
        transcript: project.transcript,
        textClips: project.textClips,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        width: project.width,
        height: project.height,
        orientation: project.orientation,
        lyricPresetId: project.lyricPresetId,
        layoutPresetId: project.layoutPresetId,
      },
    });
  } catch (error: unknown) {
    console.error("Workspace API error:", error);
    const apiError: ApiError = {
      _error: "Internal Server Error",
      message: "An unexpected error occurred",
      statusCode: 500,
    };
    return NextResponse.json({ error: apiError }, { status: 500 });
  }
}
