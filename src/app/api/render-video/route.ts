import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/db";
import Project, {
  type ProjectDocument,
  type Word as ProjectWord,
} from "@/backend/models/Project";
import { chunkWords, chunksToSrt } from "@/backend/lib/subtitles";
import { promises as fs } from "fs";
import path from "path";
import { tmpdir } from "os";
import { spawn } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import fsSync from "fs";

export const runtime = "nodejs";

function resolveFfmpegBinary(): string {
  const fromModule = (ffmpegStatic as unknown as string) || "";
  const candidates = [
    fromModule,
    "/var/task/node_modules/ffmpeg-static/ffmpeg",
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
    "ffmpeg",
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (p && p !== "ffmpeg" && fsSync.existsSync(p)) return p;
    } catch {}
  }
  return fromModule || "ffmpeg";
}

function resolveFfprobeBinary(): string {
  const fromModule =
    (ffprobeStatic as unknown as { path?: string })?.path || "";
  const candidates = [
    fromModule,
    "/var/task/node_modules/ffprobe-static/bin/ffprobe",
    path.join(
      process.cwd(),
      "node_modules",
      "ffprobe-static",
      "bin",
      "ffprobe"
    ),
    "ffprobe",
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (p && p !== "ffprobe" && fsSync.existsSync(p)) return p;
    } catch {}
  }
  return fromModule || "ffprobe";
}

async function runFfmpeg(
  args: string[]
): Promise<{ code: number; stderr: string; stdout: string }> {
  return new Promise((resolve, reject) => {
    const ffBinary = resolveFfmpegBinary();
    const ff = spawn(ffBinary, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    ff.stdout.on("data", (d) => (stdout += d.toString()));
    ff.stderr.on("data", (d) => (stderr += d.toString()));
    ff.on("error", (err) => reject(err));
    ff.on("close", (code) => resolve({ code: code ?? 0, stderr, stdout }));
  });
}

function buildSubtitlesFilter(srtPath: string): string {
  // Escape characters significant to ffmpeg filter parser for path
  const escapedPath = srtPath.replace(/\\/g, "\\\\").replace(/:/g, "\\:");
  // Keep it simple to avoid parser issues
  return `subtitles=${escapedPath}`;
}

async function probeHasVideoStream(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const ffprobeBinary = resolveFfprobeBinary();
    const ff = spawn(ffprobeBinary, [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=codec_type",
      "-of",
      "csv=p=0",
      filePath,
    ]);
    let out = "";
    ff.stdout.on("data", (d) => (out += d.toString()));
    ff.on("close", () => {
      resolve(out.trim().toLowerCase().includes("video"));
    });
    ff.on("error", () => resolve(false));
  });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const project = await Project.findById(id).lean<ProjectDocument>();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!project.song) {
      return NextResponse.json(
        { error: "Missing project song" },
        { status: 400 }
      );
    }
    if (!project.transcript || project.transcript.length === 0) {
      return NextResponse.json(
        { error: "No transcript words found" },
        { status: 400 }
      );
    }

    // Prepare temp working dir and file paths
    const workDir = await fs.mkdtemp(path.join(tmpdir(), "mv-"));
    const inputUrl = project.song;
    const srtPath = path.join(workDir, `subs-${id}.srt`);
    const localInputPath = path.join(workDir, `input-${id}.mp4`);
    const localOutputPath = path.join(workDir, `output-${id}.mp4`);

    // Download source video locally for ffmpeg
    const res = await fetch(inputUrl);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to download source video" },
        { status: 502 }
      );
    }
    const arrayBuffer = await res.arrayBuffer();
    await fs.writeFile(localInputPath, Buffer.from(arrayBuffer));

    // Build SRT from transcript words
    const words = (project.transcript as unknown as ProjectWord[]).map((w) => ({
      start: w.start,
      end: w.end,
      text: w.text,
    }));
    const chunks = chunkWords(words);
    const srt = chunksToSrt(chunks);
    await fs.writeFile(srtPath, srt, "utf8");

    // Ensure public/videos exists for final output
    const publicDir = path.join(process.cwd(), "public", "videos");
    await fs.mkdir(publicDir, { recursive: true });
    const publicOutputPath = path.join(publicDir, `${id}.mp4`);

    // Run ffmpeg to burn subtitles and ensure a video track is present
    const vf = buildSubtitlesFilter(srtPath);
    const hasVideo = await probeHasVideoStream(localInputPath);
    const ffArgs = hasVideo
      ? [
          "-y",
          "-i",
          localInputPath,
          "-vf",
          vf,
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "copy",
          localOutputPath,
        ]
      : [
          "-y",
          "-i",
          localInputPath,
          "-f",
          "lavfi",
          "-i",
          "color=size=1280x720:rate=30:color=black",
          "-shortest",
          "-vf",
          vf,
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          localOutputPath,
        ];
    const { code, stderr } = await runFfmpeg(ffArgs);
    if (code !== 0) {
      return NextResponse.json(
        { error: "ffmpeg failed", detail: stderr },
        { status: 500 }
      );
    }

    // Move final file into public/videos/{id}.mp4
    await fs.copyFile(localOutputPath, publicOutputPath);

    const publicUrl = `/videos/${id}.mp4`;
    await Project.findByIdAndUpdate(id, { video: publicUrl });

    return NextResponse.json({ video: publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to render video" },
      { status: 500 }
    );
  }
}
