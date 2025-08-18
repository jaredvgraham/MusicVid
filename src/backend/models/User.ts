import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
  clerkId: string;
  name?: string;
  email: string;
  image?: string;
  customerId?: string;
  subscriptionId?: string;
  plan?: string;
  createdAt: Date;
  updatedAt: Date;
}
//
const UserSchema = new Schema<UserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: false, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    image: { type: String },
    customerId: { type: String },
    subscriptionId: { type: String },
    plan: {
      type: String,
      enum: ["none", "Basic", "Standard", "Pro"],
      default: "none",
    },
  },
  { timestamps: true }
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
