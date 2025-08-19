import Project, { ProjectDocument } from "@/backend/models/Project";
import dbConnect from "../backend/lib/db";
import User, { UserDocument } from "../backend/models/User";
import { UserQuota } from "@/types/userQuota";

export async function checkUserPlan(clerkId: string): Promise<string | null> {
    try {
        await dbConnect();
        const user: UserDocument | null = await User.findOne({ clerkId });
        if (!user) {
            console.error("User not found");
            return null;
        }
        const plan = user.plan ?? "none";
        return plan;
    } catch (error) {
        console.error("Error checking user plan", error);
        return null;
    }
}

export async function getUserQuota(clerkId: string): Promise<UserQuota | null> {
    try {
        await dbConnect();
        const user: UserDocument | null = await User.findOne({ clerkId });
        if (!user) {
            console.error("User not found");
            return null;
        }
        const projects = await Project.find({
            user_id: clerkId,
            createdAt: {
                $gte: user.billingPeriodStart,
                $lte: user.billingPeriodEnd,
            }
        })
        const projectCount = projects.length;
        const finalRenders = projects.filter((project: ProjectDocument) => project.finalRender).length;
        return {
            finalRenders,
            projects: projectCount,
        }
    } catch (error) {
        console.error("Error getting user quota", error);
        return null;
    }
}