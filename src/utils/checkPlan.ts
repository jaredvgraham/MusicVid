import Project, { ProjectDocument } from "@/backend/models/Project";
import dbConnect from "../backend/lib/db";
import User, { UserDocument } from "../backend/models/User";
import ProductQuotas, { ActionType, Product, Quota } from "@/types/productQuotas";

export interface UserUsage {
    user: UserDocument;
    usage: Quota;
}

export interface Remaining {
    allowed: boolean;
    projects: number;
    finalRenders: number;
}

const planMap: Record<string, Product> = {
    "none": Product.NONE,
    "Basic": Product.BASIC,
    "Standard": Product.STANDARD,
    "Pro": Product.PRO,
}

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

export async function getUserUsage(clerkId: string): Promise<UserUsage | null> {
    try {
        await dbConnect();
        const user: UserDocument | null = await User.findOne({ clerkId });
        if (!user) {
            console.error("User not found");
            return null;
        }
        const start = user.billingPeriodStart;
        const end = user.billingPeriodEnd;
        if (!start || !end) {
            console.error("Billing period not found");
            return null;
        }
        if (start > end) {
            console.error("Billing period is invalid");
            return null;
        }
        if (!(start instanceof Date) || !(end instanceof Date) || start >= end){ 
            return null 
        }
        
        const [projectCount, finalRenders] = await Promise.all([
            Project.countDocuments({
                user_id: clerkId,
                createdAt: {
                    $gte: start,
                    $lte: end,
                }
            }),
            Project.countDocuments({
                user_id: clerkId,
                createdAt: {
                    $gte: start,
                    $lte: end,
                },
                finalRender: {
                    $exists: true,
                    $ne: null,
                },
            })
        ])
        return {
            user,
            usage: {
                finalRenders,
                projects: projectCount,
            }
        }
    } catch (error) {
        console.error("Error getting user quota", error);
        return null;
    }
}

export async function checkQuota(clerkId: string, action: ActionType): Promise<Remaining> {
    try {
        const userUsage: UserUsage | null = await getUserUsage(clerkId);
        if (!userUsage) {
            console.error("User usage not found");
            return {
                allowed: false,
                projects: 0,
                finalRenders: 0,
            }
        }
        if (!userUsage.user.plan) {
            console.error("User plan not found");
            return {
                allowed: false,
                projects: 0,
                finalRenders: 0,
            }
        }
        const plan = planMap[userUsage.user.plan];
        if (!plan) {
            console.error("Plan not found");
            return {
                allowed: false,
                projects: 0,
                finalRenders: 0,
            }
        }
        const quota: Quota = ProductQuotas.getQuotas(plan);
        if (!quota) {
            console.error("Quota not found");
            return {
                allowed: false,
                projects: 0,
                finalRenders: 0,
            }
        }
        if (action === "project") {
            if (userUsage.usage.projects >= quota.projects) {
                return {
                    allowed: false,
                    projects: 0,
                    finalRenders: 0,
                }
            }
        } else if (action === "finalRender") {
            if (userUsage.usage.finalRenders >= quota.finalRenders) {
                    return {
                    allowed: false,
                    projects: 0,
                    finalRenders: 0,
                }
            }
        }
        return {
            allowed: true,
            projects: quota.projects - userUsage.usage.projects,
            finalRenders: quota.finalRenders - userUsage.usage.finalRenders,
        }
    } catch (error) {
        console.error("Error checking quota", error);
        return {
            allowed: false,
            projects: 0,
            finalRenders: 0,
        }
    }
}