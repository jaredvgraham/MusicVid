import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ProjectClient from "@/backend/lib/projectClient";
import { ApiError } from "next/dist/server/api-utils";
import Utils from "@/utils/utils";

export async function DELETE(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
    const { userId } = await auth();
    if (!userId) {
        console.error("Unauthorized");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { projectId } = await context.params;
        const response = await ProjectClient.deleteProject(projectId);
        if (response instanceof ApiError) {
            return NextResponse.json({ error: response }, { status: response.statusCode });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: unknown) {
        const err = Utils.handleApiError(error);
        return NextResponse.json({ error: err }, { status: err.statusCode });
    }
}