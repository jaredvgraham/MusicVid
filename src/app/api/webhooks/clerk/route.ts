import { WebhookEvent } from "@clerk/nextjs/server";
import User from "@/backend/models/User";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/db";

export const maxDuration = 300; // 300 seconds or 5 minutes
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Entry log
  console.log("[Clerk Webhook] invoked");

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint

  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
      );
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        id: clerkId,
        email_addresses,
        image_url,
        first_name,
        last_name,
      } = evt.data;

      await dbConnect();

      const email = email_addresses?.[0]?.email_address ?? "";
      const name =
        [first_name, last_name].filter(Boolean).join(" ") || undefined;
      const image = image_url || undefined;

      const newUser = await User.findOneAndUpdate(
        { clerkId },
        { clerkId, email, name, image },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log("user upserted", newUser?._id?.toString());
      return NextResponse.json({ message: "User upserted", status: 200 });
    }

    console.log(`Webhook with ID ${id} and type ${eventType}`);
    console.log("Webhook body:", body);

    return new Response("", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error occured", {
      status: 500,
    });
  }
}
