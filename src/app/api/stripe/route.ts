import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User, { UserDocument } from "@/backend/models/User";
import dbConnect from "@/backend/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.split("/api")[0];

// CORS: allow marketing domain to call this API in production
const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function buildCorsHeaders(req: NextRequest): HeadersInit {
  const origin = req.headers.get("origin") || "";
  const allowOrigin =
    (ALLOWED_ORIGINS.length === 0 && origin) ||
    (ALLOWED_ORIGINS.includes(origin) ? origin : (ALLOWED_ORIGINS[0] as string) || "*");
  const headers: HeadersInit = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "OPTIONS, POST, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
  if (allowOrigin !== "*") (headers as any)["Access-Control-Allow-Credentials"] = "true";
  return headers;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: buildCorsHeaders(req) });
}

// Map your plan keys to Stripe Price IDs from your dashboard
const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_BASIC_PRICE_ID as string,
  standard: process.env.STRIPE_STANDARD_PRICE_ID as string,
  pro: process.env.STRIPE_PRO_PRICE_ID as string,
};

async function getOrCreateCustomerId(user: UserDocument) {
  const customerId = user.customerId;
  if (!customerId) {
    console.log("Creating customer");

    const customer = await stripe.customers.create({
      email: user.email,
    });
    return customer.id;
  }
  return customerId;
}

export async function POST(req: NextRequest) {
  console.log("POST log /api/stripe");
  try {
    await dbConnect();
    const { userId } = await auth();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { plan } = await req.json();
    if (user.plan === plan) {
      return NextResponse.json(
        { message: "User already subscribed to this plan" },
        { status: 400 }
      );
    }
    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
    }
    // get or create customer Id
    const customerId = await getOrCreateCustomerId(user);
    user.customerId = customerId;
    await user.save();
    // Create a checkout session for the purchase
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${BASE_URL}/`,
      cancel_url: `${BASE_URL}/pricing`,
    });
    return NextResponse.json(
      { url: session.url },
      { headers: buildCorsHeaders(req) }
    );
  } catch (error: any) {
    console.log("Error creating checkout session", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: buildCorsHeaders(req) }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: buildCorsHeaders(req) }
      );
    }
    const { newPlan } = await req.json();
    if (user.plan === newPlan) {
      return NextResponse.json(
        { message: "User already subscribed to this plan" },
        { status: 400 }
      );
    }
    // get or create customer Id
    const customerId = await getOrCreateCustomerId(user);
    // Create a checkout session for the purchase
    if (!user.subscriptionId) {
      return NextResponse.json(
        { message: "No active subscription" },
        { status: 400, headers: buildCorsHeaders(req) }
      );
    }
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionId
    );
    const priceId = PRICE_IDS[newPlan];
    if (!priceId) {
      return NextResponse.json(
        { message: "Invalid plan" },
        { status: 400, headers: buildCorsHeaders(req) }
      );
    }
    const updatedSubscription = await stripe.subscriptions.update(
      user.subscriptionId,
      {
        cancel_at_period_end: false,
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: "create_prorations",
      }
    );

    return NextResponse.json(
      { status: 200, message: "Subscription updated" },
      { headers: buildCorsHeaders(req) }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: buildCorsHeaders(req) }
    );
  }
}
