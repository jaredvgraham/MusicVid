import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ApiError } from "@/types/ApiError";
import ProjectClient from "@/backend/lib/projectClient";
import { getObjectUrl as getS3ObjectUrl } from "@/backend/lib/s3";

export async function GET(request: Request) {
  try {
    console.log("Admin API called");

    // Check if the current user is authenticated
    const { userId: currentUserId } = await auth();
    console.log("Current user ID:", currentUserId);

    const user = await currentUser();
    if (!user) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be logged in to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }
    if (
      user.primaryEmailAddress?.emailAddress !==
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be an admin to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    if (!currentUserId) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be logged in to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    // TODO: Add admin role check here if you have role-based access control
    // For now, we'll allow any authenticated user to access this endpoint
    // You can add admin role verification like:
    // const user = await User.findOne({ clerkId: currentUserId });
    // if (user?.role !== 'admin') { return unauthorized error }

    // Get the userId from query parameters
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");
    console.log("Target user ID:", targetUserId);

    if (!targetUserId) {
      const error: ApiError = {
        _error: "Bad Request",
        message: "userId query parameter is required",
        statusCode: 400,
      };
      return NextResponse.json({ error }, { status: 400 });
    }

    // Fetch projects for the target user
    console.log("Fetching projects for user:", targetUserId);
    const result = await ProjectClient.getProjects(targetUserId);
    console.log("ProjectClient result:", result);

    if (Array.isArray(result)) {
      const projects = await Promise.all(
        result.map(async (doc) => {
          let video = doc.video as any;
          const key = (doc as any).videoKey as string | undefined;

          // Get S3 URL if videoKey exists
          if (key) {
            try {
              video = await getS3ObjectUrl(key);
            } catch {}
          }

          return {
            _id: doc._id.toString(),
            song: doc.song,
            name: doc.name,
            timeCreated:
              doc.time_created instanceof Date
                ? doc.time_created.toISOString()
                : (doc.time_created as any),
            failed: doc.failed,
            video,
            videoKey: (doc as any).videoKey,
            s3_url: (doc as any).s3_url,
            transcript: (doc as any).transcript,
            textClips: (doc as any).textClips,
            finalRender: (doc as any).finalRender,
            video_url: (doc as any).video_url,
            width: (doc as any).width,
            height: (doc as any).height,
            orientation: (doc as any).orientation,
            renderInProgress: (doc as any).renderInProgress,
            length: (doc as any).length,
          };
        })
      );

      // Calculate statistics
      const totalProjects = projects.length;
      const activeProjects = projects.filter(
        (p) => !p.failed && !p.renderInProgress && !p.finalRender
      ).length;
      const failedProjects = projects.filter((p) => p.failed).length;
      const projectsWithFinalRenders = projects.filter(
        (p) => p.finalRender
      ).length;
      const projectsWithVideos = projects.filter(
        (p) => p.video_url || p.video
      ).length;
      const projectsWithLyrics = projects.filter(
        (p) => (p as any).lyrics
      ).length;

      const response = {
        userId: targetUserId,
        projects,
        totalProjects,
        activeProjects,
        failedProjects,
        projectsWithFinalRenders,
        projectsWithVideos,
        projectsWithLyrics,
      };

      console.log("Sending response:", response);
      return NextResponse.json(response);
    } else {
      // Handle error from ProjectClient
      const status = result.statusCode ?? 500;
      return NextResponse.json({ error: result }, { status });
    }
  } catch (error: unknown) {
    console.error("Admin user-projects API error:", error);
    const apiError: ApiError = {
      _error: "Internal Server Error",
      message: "An unexpected error occurred",
      statusCode: 500,
    };
    return NextResponse.json({ error: apiError }, { status: 500 });
  }
}
