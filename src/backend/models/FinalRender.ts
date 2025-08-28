// This is a model for the final render of a project.
import { Document, Schema, model } from "mongoose";

interface FinalRenderDocument extends Document {
  userId: string;
  projectId: string;
  renderUrl: string;
  renderKey: string;
  createdAt: Date;
}

const finalRenderSchema = new Schema({
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  renderUrl: { type: String, required: true },
  renderKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FinalRender = model<FinalRenderDocument>(
  "FinalRender",
  finalRenderSchema
);

export default FinalRender;
