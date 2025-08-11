import Project from "@/backend/models/Project";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, context: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await context.params;
    if (!projectId) {
        return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.video) {
        return NextResponse.json({ completed: true }, { status: 200 });
    }

    return NextResponse.json({ completed: false }, { status: 200 });
}