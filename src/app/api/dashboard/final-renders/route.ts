import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/backend/models/User";
import Utils from "@/utils/utils";
import Project from "@/backend/models/Project";


export async function GET(request: NextRequest) {
    const { userId } = await auth();
    try {
    if (!userId) {
        console.error("Unauthorized request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } 
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        console.error("User not found");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const finalRenders = await Project.find({ user_id: userId, finalRender: { $exists: true }});
    const urls = finalRenders.map((render) => render.finalRender);
    return NextResponse.json({ urls }, { status: 200 });
} catch (error: unknown) {
    const err = Utils.handleApiError(error);
    return NextResponse.json({ error: err }, { status: err.statusCode });
}
}