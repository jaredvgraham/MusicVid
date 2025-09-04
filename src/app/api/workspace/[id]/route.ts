import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ApiError } from "@/types/ApiError";
import ProjectClient from "@/backend/lib/projectClient";
import { getObjectUrl as getS3ObjectUrl } from "@/backend/lib/s3";
import User from "@/backend/models/User";
import Preset from "@/backend/models/Preset";
import { Project } from "@/backend/models/Project";
import dbConnect from "@/backend/lib/db";

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

    const { id } = await context.params;
    if (!id) {
      const error: ApiError = {
        _error: "Bad Request",
        message: "Project ID is required",
        statusCode: 400,
      };
      return NextResponse.json({ error }, { status: 400 });
    }

    // Connect to database once
    await dbConnect();

    // Get the project using ProjectClient (skip dbConnect since we already connected)
    const result = await ProjectClient.getProject(id, true);

    if ("_error" in result) {
      // Handle error from ProjectClient
      const status = result.statusCode ?? 500;
      return NextResponse.json({ error: result }, { status });
    }

    const project = result;

    // Check if user owns the project or is admin
    const isOwner = userId === project.user_id;

    if (!isOwner) {
      // Check if user is admin using database lookup (much faster than currentUser())
      const user = await User.findOne({ clerkId: userId })
        .select("email")
        .lean();

      if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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

    // Fetch the full preset data if lyricPresetId exists
    let lyricPreset = null;
    if (project.lyricPresetId) {
      console.log("project.lyricPresetId", project.lyricPresetId);
      try {
        // Check if lyricPresetId is a MongoDB ObjectId (24 hex chars) or a string preset ID
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(project.lyricPresetId);

        if (isObjectId) {
          // New system: lyricPresetId is an ObjectId pointing to a Preset document
          const presetDoc = await Preset.findById(project.lyricPresetId).lean();
          console.log("presetDoc found:", !!presetDoc);
          if (presetDoc) {
            console.log("presetDoc keys:", Object.keys(presetDoc));

            // Use lyricPreset field (already migrated)
            lyricPreset = presetDoc.lyricPreset;
            console.log("lyricPreset name:", lyricPreset?.name);
          }
        } else {
          // Old system: lyricPresetId is a string like "classic" - migrate to new system
          const { getSystemPreset } = await import(
            "@/features/workspace/services/presetService"
          );
          const systemPreset = getSystemPreset(project.lyricPresetId);
          if (systemPreset) {
            // Create a new preset document for this project
            const presetDoc = new Preset({
              projectId: project._id.toString(),
              lyricPreset: systemPreset,
            });
            await presetDoc.save();

            // Update the project to use the new preset document
            await Project.findByIdAndUpdate(project._id, {
              lyricPresetId: presetDoc._id.toString(),
            });

            console.log(
              `[migration] Created preset document for project ${project._id} (${systemPreset.name}): ${presetDoc._id}`
            );

            // Return the preset data
            lyricPreset = systemPreset;
          }
        }
      } catch (error) {
        console.warn("Failed to fetch preset:", error);
      }
    }

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
        layoutPresetId: project.layoutPresetId,
        transcriptRefreshes: project.transcriptRefreshes,
      },
      lyricPreset,
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
