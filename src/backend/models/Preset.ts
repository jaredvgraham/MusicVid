import mongoose, { Schema, Document, Model } from "mongoose";
import type { LyricPreset } from "@/features/workspace/styles/lyricPresets";

export interface PresetDocument extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: string; // Reference to the project this preset belongs to
  lyricPreset: LyricPreset; // The full preset object
  updatedAt: Date;
}

const PresetSchema = new Schema<PresetDocument>(
  {
    projectId: { type: String, required: true, index: true },
    lyricPreset: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true }, strict: false }
);

export const Preset: Model<PresetDocument> =
  mongoose.models.Preset ||
  mongoose.model<PresetDocument>("Preset", PresetSchema);

export default Preset;
