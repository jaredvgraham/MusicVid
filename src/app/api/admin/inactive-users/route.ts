import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ApiError } from "@/types/ApiError";
import dbConnect from "@/backend/lib/db";
import User from "@/backend/models/User";
import Project from "@/backend/models/Project";

export async function GET(request: NextRequest) {
  try {
    console.log("Admin inactive users API called");

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

    // Get all user IDs who have created projects
    const usersWithProjects = await Project.distinct("user_id", {
      deleted: false,
    });
    console.log(`Found ${usersWithProjects.length} users with projects`);

    // Find users who haven't created any projects
    const inactiveUsers = allUsers.filter(
      (user) => !usersWithProjects.includes(user.clerkId)
    );

    console.log(`Found ${inactiveUsers.length} inactive users`);

    // Format the response
    const inactiveUsersData = inactiveUsers.map((user) => ({
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      plan: user.plan,
      createdAt: user.createdAt,
      daysSinceSignup: Math.floor(
        (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));

    return NextResponse.json({
      success: true,
      inactiveUsers: inactiveUsersData,
      totalUsers: allUsers.length,
      usersWithProjects: usersWithProjects.length,
      inactiveCount: inactiveUsers.length,
    });
  } catch (error: any) {
    console.error("Error fetching inactive users:", error);
    const apiError: ApiError = {
      _error: "Internal Server Error",
      message: error.message || "Failed to fetch inactive users",
      statusCode: 500,
    };
    return NextResponse.json({ error: apiError }, { status: 500 });
  }
}
