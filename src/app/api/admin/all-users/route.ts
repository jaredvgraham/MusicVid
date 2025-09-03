import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ApiError } from "@/types/ApiError";
import dbConnect from "@/backend/lib/db";
import User from "@/backend/models/User";
import Project from "@/backend/models/Project";
import FinalRender from "@/backend/models/FinalRender";

interface UserWithStats {
  clerkId: string;
  email: string;
  name?: string;
  plan: string;
  createdAt: string;
  projects: Array<{
    _id: string;
    name: string;
    time_created: string;
    failed: boolean;
    hasVideo: boolean;
    hasLyrics: boolean;
    hasFinalRender: boolean;
    finalRenderUrl?: string;
  }>;
  totalProjects: number;
  activeProjects: number;
  failedProjects: number;
  projectsWithFinalRenders: number;
  totalFinalRenders: number;
}

export async function GET(request: NextRequest) {
  try {
    console.log("Admin all users API called");

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

    // Check if user is admin
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

    // Connect to database
    await dbConnect();

    // Get all users
    const allUsers = await User.find({}).sort({ createdAt: -1 });
    console.log(`Found ${allUsers.length} total users`);

    // Get all projects for all users
    const allProjects = await Project.find({ deleted: false }).sort({
      time_created: -1,
    });
    console.log(`Found ${allProjects.length} total projects`);

    // Get all final renders
    const allFinalRenders = await FinalRender.find({}).sort({ createdAt: -1 });
    console.log(`Found ${allFinalRenders.length} total final renders`);

    // Group projects by user_id
    const projectsByUser = allProjects.reduce((acc, project) => {
      if (!acc[project.user_id]) {
        acc[project.user_id] = [];
      }
      acc[project.user_id].push(project);
      return acc;
    }, {} as Record<string, any[]>);

    // Group final renders by userId
    const finalRendersByUser = allFinalRenders.reduce((acc, render) => {
      if (!acc[render.userId]) {
        acc[render.userId] = [];
      }
      acc[render.userId].push(render);
      return acc;
    }, {} as Record<string, any[]>);

    // Build user statistics
    const usersWithStats: UserWithStats[] = allUsers.map((user) => {
      const userProjects = projectsByUser[user.clerkId] || [];
      const userFinalRenders = finalRendersByUser[user.clerkId] || [];

      // Create a map of project ID to final render for quick lookup
      const projectFinalRenderMap = userFinalRenders.reduce((acc, render) => {
        if (render.projectId) {
          acc[render.projectId] = render;
        }
        return acc;
      }, {} as Record<string, any>);

      const projects = userProjects.map((project) => ({
        _id: project._id.toString(),
        name: project.name,
        time_created: project.time_created.toISOString(),
        failed: project.failed,
        hasVideo: !!project.video || !!project.videoKey,
        hasLyrics: !!project.lyrics,
        hasFinalRender: !!projectFinalRenderMap[project._id.toString()],
        finalRenderUrl:
          projectFinalRenderMap[project._id.toString()]?.renderUrl,
      }));

      const totalProjects = userProjects.length;
      const activeProjects = userProjects.filter((p) => !p.failed).length;
      const failedProjects = userProjects.filter((p) => p.failed).length;
      const projectsWithFinalRenders = userProjects.filter(
        (p) => projectFinalRenderMap[p._id.toString()]
      ).length;

      return {
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        plan: user.plan || "Free",
        createdAt: user.createdAt.toISOString(),
        projects,
        totalProjects,
        activeProjects,
        failedProjects,
        projectsWithFinalRenders,
        totalFinalRenders: userFinalRenders.length,
      };
    });

    // Calculate overall statistics
    const totalUsers = allUsers.length;
    const usersWithProjects = usersWithStats.filter(
      (u) => u.totalProjects > 0
    ).length;
    const totalProjects = allProjects.length;
    const totalFinalRenders = allFinalRenders.length;

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      statistics: {
        totalUsers,
        usersWithProjects,
        usersWithoutProjects: totalUsers - usersWithProjects,
        totalProjects,
        totalFinalRenders,
        averageProjectsPerUser:
          totalUsers > 0 ? (totalProjects / totalUsers).toFixed(2) : "0",
        averageFinalRendersPerUser:
          totalUsers > 0 ? (totalFinalRenders / totalUsers).toFixed(2) : "0",
      },
    });
  } catch (error: any) {
    console.error("Error fetching all users:", error);
    const apiError: ApiError = {
      _error: "Internal Server Error",
      message: error.message || "Failed to fetch all users",
      statusCode: 500,
    };
    return NextResponse.json({ error: apiError }, { status: 500 });
  }
}
