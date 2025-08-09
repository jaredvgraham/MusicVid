import mongoose, { Schema, Document, Model } from "mongoose";

export interface Word {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

export interface ProjectDocument extends Document {
  userId: string;
  timeCreated: Date;
  failed: boolean;
  s3_url?: string;
  transcript?: Word[];
  video?: string;
  song?: string;
  callbackStatus?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    userId: { type: String, required: true, index: true },
    timeCreated: { type: Date, required: true, default: Date.now },
    failed: { type: Boolean, required: true, default: false },
    s3_url: { type: String },
    callbackStatus: { type: Number },
    transcript: { type: Array },
    video: { type: String },
    song: { type: String },
  },
  { timestamps: true }
);

export const Project: Model<ProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;
