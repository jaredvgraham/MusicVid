import { ActionType } from "@/types/productQuotas";
import { checkQuota } from "@/utils/checkPlan";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const actionMap: Record<string, ActionType> = {
    "project": "project",
    "finalRender": "finalRender",
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("User not authenticated");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const params = request.nextUrl.searchParams;
        const action = params.get("action");
        if (!action) {
            console.error("Action is not provided");
            return NextResponse.json({ error: "Action is not provided" }, { status: 400 });
        }
        const actionType = actionMap[action];
        if (!actionType) {
            console.error("Invalid action");
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
        const remaining = await checkQuota(userId, actionType);
        return NextResponse.json({
            allowed: remaining.allowed,
            projects: remaining.projects,
            finalRenders: remaining.finalRenders,
        });
    } catch (error) {
        console.error("Error checking quota", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}