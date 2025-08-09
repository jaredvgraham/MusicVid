import mongoose from "mongoose";

// Keep a cached connection across hot reloads in development to avoid creating many connections
declare global {
  var mongooseConn: Promise<typeof mongoose> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your environment"
  );
}

let cached = global.mongooseConn;

if (!cached) {
  cached = mongoose.connect(MONGODB_URI, {
    dbName: "app",
  });
  global.mongooseConn = cached;
}

export async function dbConnect(): Promise<typeof mongoose> {
  return cached as Promise<typeof mongoose>;
}

export default dbConnect;
