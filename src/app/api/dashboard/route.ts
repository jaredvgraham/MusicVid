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
<<<<<<< HEAD
        const mapped = result.map((doc) => {
            const rawVideo = (doc as any).video as string | undefined;
            const s3Url = (doc as any).s3_url as string | undefined;
            const video = (rawVideo && rawVideo.trim().length > 0) ? rawVideo : s3Url;
            const isoTime = doc.timeCreated instanceof Date ? doc.timeCreated.toISOString() : (doc.timeCreated as any);
            return {
                _id: doc._id.toString(),
                // only expose explicit name; do NOT fall back to song
                name: (doc as any).name ?? undefined,
                song: (doc as any).song,
                timeCreated: isoTime,
                failed: (doc as any).failed === true,
                video,
            };
        });
        mapped.sort((a, b) => {
            const aHas = a.video && String(a.video).trim().length > 0 ? 1 : 0;
            const bHas = b.video && String(b.video).trim().length > 0 ? 1 : 0;
            if (bHas !== aHas) return bHas - aHas;
            return new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime();
        });
        return NextResponse.json({ projects: mapped });
=======
        const projects = result.map((doc) => ({
            _id: doc._id.toString(),
            song: doc.song,
            name: doc.name || undefined,
            timeCreated: doc.timeCreated instanceof Date ? doc.timeCreated.toISOString() : (doc.timeCreated as any),
            video: doc.video ?? (doc as any).s3_url,
        }));
        console.log(JSON.stringify(projects, null, 2));
        return NextResponse.json({ projects });
>>>>>>> b2efbc6c382940ef1a58f2b445c2e96b76b2de15
    } else {
        const status = result.statusCode ?? 500;
        return NextResponse.json({ error: result }, { status });
    }
}