import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ApiError } from "@/types/ApiError";
import ProjectClient from "@/backend/lib/projectClient";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    const error: ApiError = {
      _error: "Unauthorized",
      message: "You must be logged in to access this resource",
      statusCode: 401,
    };
    return NextResponse.json({ error }, { status: 401 });
  }

  const result = await ProjectClient.getProjects(userId);

  if (Array.isArray(result)) {
    console.log(result);
    const projects = result.map((doc) => ({
      _id: doc._id.toString(),
      song: doc.song,
      name: doc.name,
      timeCreated:
        doc.time_created instanceof Date
          ? doc.time_created.toISOString()
          : (doc.time_created as any),
      video: doc.video ?? (doc as any).s3_url,
    }));
    console.log(JSON.stringify(projects, null, 2));
    return NextResponse.json({ projects });
  } else {
    const status = result.statusCode ?? 500;
    return NextResponse.json({ error: result }, { status });
  }
}
