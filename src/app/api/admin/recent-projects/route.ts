import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Project from "@/backend/models/Project";
import User from "@/backend/models/User";
import FinalRender from "@/backend/models/FinalRender";
import dbConnect from "@/backend/lib/db";
import { getObjectUrl as getS3ObjectUrl } from "@/backend/lib/s3";
import { ApiError } from "@/types/ApiError";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Check if user is admin (using email-based check like the frontend)
    if (!userId) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "Authentication required",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    // Get user info to check admin email
    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "Admin access required",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    // Fetch 20 most recent projects with user info
    const projects = await Project.find({ deleted: { $ne: true } })
      .sort({ time_created: -1 })
      .limit(20)
      .lean();

    // Get unique user IDs
    const userIds = [...new Set(projects.map((p) => p.user_id))];

    // Fetch user information for all users
    const users = await User.find({ clerkId: { $in: userIds } })
      .select("clerkId name email image plan")
      .lean();

    // Create user lookup map
    const userMap = new Map(users.map((user) => [user.clerkId, user]));

    // Fetch final renders for all projects
    const projectIds = projects.map((p) => p._id.toString());
    const finalRenders = await FinalRender.find({
      projectId: { $in: projectIds },
    }).lean();

    // Group final renders by project ID
    const finalRenderMap = new Map<string, any[]>();
    finalRenders.forEach((render) => {
      if (!finalRenderMap.has(render.projectId)) {
        finalRenderMap.set(render.projectId, []);
      }
      finalRenderMap.get(render.projectId)!.push(render);
    });

    // Process projects with user info and final renders
    const processedProjects = await Promise.all(
      projects.map(async (project) => {
        const user = userMap.get(project.user_id);
        const projectFinalRenders =
          finalRenderMap.get(project._id.toString()) || [];

        // Get fresh S3 URLs for video and final renders
        let videoUrl = project.video || "";
        if (project.videoKey) {
          try {
            videoUrl = await getS3ObjectUrl(project.videoKey);
          } catch (error) {
            console.warn(
              "Failed to get S3 URL for videoKey:",
              project.videoKey
            );
          }
        }

        // Get fresh S3 URLs for final renders
        const finalRenderUrls = await Promise.all(
          projectFinalRenders.map(async (render) => {
            try {
              const url = await getS3ObjectUrl(render.renderKey);
              return {
                _id: render._id.toString(),
                renderUrl: url,
                renderKey: render.renderKey,
                createdAt: render.createdAt,
              };
            } catch (error) {
              console.warn(
                "Failed to get S3 URL for renderKey:",
                render.renderKey
              );
              return {
                _id: render._id.toString(),
                renderUrl: render.renderUrl,
                renderKey: render.renderKey,
                createdAt: render.createdAt,
              };
            }
          })
        );

        return {
          _id: project._id.toString(),
          name: project.name,
          song: project.song,
          lyrics: project.lyrics,
          time_created: project.time_created,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          failed: project.failed,
          length: project.length,
          width: project.width,
          height: project.height,
          orientation: project.orientation,
          video: videoUrl,
          videoKey: project.videoKey,
          transcript: project.transcript,
          textClips: project.textClips,
          lyricPresetId: project.lyricPresetId,
          layoutPresetId: project.layoutPresetId,
          transcriptRefreshes: project.transcriptRefreshes,
          user: user
            ? {
                clerkId: user.clerkId,
                name: user.name,
                email: user.email,
                image: user.image,
                plan: user.plan,
              }
            : null,
          finalRenders: finalRenderUrls,
        };
      })
    );

    return NextResponse.json({
      projects: processedProjects,
      total: processedProjects.length,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error("Admin recent projects API error:", error);
    const apiError: ApiError = {
      _error: "Internal Server Error",
      message: "An unexpected error occurred while fetching recent projects",
      statusCode: 500,
    };
    return NextResponse.json({ error: apiError }, { status: 500 });
  }
}
