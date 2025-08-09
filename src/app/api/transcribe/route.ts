import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI, TranscribeParams } from "assemblyai";
import Project, { type ProjectDocument } from "@/backend/models/Project";
import dbConnect from "@/backend/lib/db";

const client = new AssemblyAI({
  apiKey: "2906532ac3d6467085606643ceba6b37",
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { id } = await req.json();
    console.log("id", id);

    const project = await Project.findById(id).lean<ProjectDocument>();
    if (!project) {
      console.log("Project not found");
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("project", project);
    console.log("project.s3_url", project?.s3_url);
    if (!project?.s3_url) {
      console.log("Missing project s3Url");
      return NextResponse.json(
        { error: "Missing project s3Url" },
        { status: 400 }
      );
    }

    const params = {
      audio: project.s3_url,
      speech_model: "universal",
    };

    const transcript = await client.transcripts.transcribe(
      params as TranscribeParams
    );

    console.log(transcript.text);
    console.log(transcript.words);
    await Project.findByIdAndUpdate(id, { transcript: transcript.words });
    const res = await fetch(
      "https://lyricsync-production.up.railway.app/render",
      {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
      }
    );
    if (!res.ok) {
      console.log("Failed to render lyrics", res.statusText);
      return NextResponse.json(
        { error: "Failed to render lyrics", status: res.statusText },
        { status: 500 }
      );
    }
    console.log("res", res);
    return NextResponse.json({ id: transcript.id, text: transcript.text });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to transcribe" },
      { status: 500 }
    );
  }
}
