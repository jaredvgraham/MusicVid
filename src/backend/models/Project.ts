import mongoose, { Schema, Document, Model } from "mongoose";

export interface Word {
  start: number;
  end: number;
  text: string;
  confidence: number;
  // Optional per-word styling and placement overrides
  xPct?: number; // 0-100
  yPct?: number; // 0-100
  rotationDeg?: number;
  scale?: number;
  zIndex?: number;
  opacity?: number;
  style?: {
    color?: string;
    fontSizePx?: number;
    fontFamily?: string;
    letterSpacingPx?: number;
    textShadow?: string;
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    textAlign?: "left" | "center" | "right";
    fontWeight?: number | string;
    backgroundColor?: string;
    borderRadiusPx?: number;
    paddingX?: number;
    paddingY?: number;
    gradientText?: { from: string; to: string };
  };
}

export interface TextClip {
  start: number;
  end: number;
  text: string;
  xPct: number; // 0-100
  yPct: number; // 0-100
}

export interface Line {
  start: number;
  end: number;
  words: Word[];
}

export interface ProjectDocument extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: string;
  time_created: Date;
  name: string;
  failed: boolean;
  s3_url?: string;
  transcript?: Line[];
  textClips?: TextClip[];
  video?: string; // deprecated: presigned URL or public URL
  videoKey?: string; // canonical S3 object key
  song?: string;
  lyrics?: string;
  lyricPresetId?: string;
  callback_status?: number;
  createdAt: Date;
  updatedAt: Date;
  length: number;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    user_id: { type: String, required: true, index: true },
    time_created: { type: Date, required: true, default: Date.now },
    name: { type: String, required: true },
    failed: { type: Boolean, required: true, default: false },
    s3_url: { type: String },
    callback_status: { type: Number },
    transcript: { type: Array<Line> },
    textClips: { type: Array },
    video: { type: String },
    videoKey: { type: String },
    song: { type: String },
    lyrics: { type: String },
    lyricPresetId: { type: String },
  },
  { timestamps: true }
);

export const Project: Model<ProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;
