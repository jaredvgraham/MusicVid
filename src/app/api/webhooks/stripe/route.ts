import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import User, { UserDocument } from "@/backend/models/User";
import dbConnect from "@/backend/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

export async function POST(req: NextRequest) {
  console.log("Stripe webhook received");
  console.log("webhookSecret", webhookSecret);

  const client = await clerkClient();
  await dbConnect();
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      webhookSecret as string
    );
    console.log("[stripe:webhook] event constructed", {
      type: event.type,
      id: (event as any)?.id,
    });
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[stripe:webhook] checkout.session.completed", {
        sessionId: session.id,
        customer: session.customer,
        subscription: session.subscription,
        mode: session.mode,
      });

      // Fetch line items for the session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          limit: 100,
        }
      );
      console.log(
        "[stripe:webhook] checkout.session.completed line items",
        lineItems.data.map((li) => ({
          description: li.description,
          priceId: (li.price as any)?.id,
          productId:
            (typeof (li.price as any)?.product === "string"
              ? (li.price as any)?.product
              : undefined) || undefined,
        }))
      );

      let productName = "";

      for (const item of lineItems.data) {
        if (!item.price) return;

        const price = item.price as Stripe.Price;
        if (price.product && typeof price.product === "string") {
          const product = await stripe.products.retrieve(price.product);
          productName = product.name;
          console.log(
            "[stripe:webhook] resolved product",
            price.product,
            product.name
          );
        }
      }

      const subId = session.subscription;
      const email = session.customer_details?.email;
      console.log("[stripe:webhook] checkout session user lookup", {
        customer: session.customer,
        email,
        productName,
        subscriptionId: subId,
      });

      const user = await User.findOne({ customerId: session.customer });
      if (!user) {
        console.log(
          "[stripe:webhook] user not found for customer",
          session.customer
        );
        return NextResponse.json({
          status: "error",
          message: "User not found",
        });
      }

      user.subscriptionId = subId as string;
      user.plan = productName;
      console.log("[stripe:webhook] updating user", {
        clerkId: user.clerkId,
        subscriptionId: user.subscriptionId,
        plan: user.plan,
      });
      await client.users.updateUser(user.clerkId, {
        publicMetadata: {
          plan: productName,
        },
      });

      await user.save();
      console.log("[stripe:webhook] user updated and saved");
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("[stripe:webhook] subscription.updated", {
        subscriptionId: subscription.id,
        status: subscription.status,
        customer: subscription.customer,
      });
      const user = await User.findOne({ customerId: subscription.customer });
      if (!user) {
        console.log(
          "[stripe:webhook] user not found for customer",
          subscription.customer
        );
        return NextResponse.json({
          status: "error",
          message: "User not found",
        });
      }
      const lineItems = await stripe.subscriptionItems.list({
        subscription: subscription.id,
        limit: 100,
      });
      let productName = "";
      for (const item of lineItems.data) {
        if (!item.price) return;
        const price = item.price as Stripe.Price;
        if (price.product && typeof price.product === "string") {
          const product = await stripe.products.retrieve(price.product);
          productName = product.name;
          console.log(
            "[stripe:webhook] updated resolved product",
            price.product,
            product.name
          );
        }
      }
      user.subscriptionId = subscription.id;
      user.plan = productName;
      console.log("[stripe:webhook] updating user after update", {
        clerkId: user.clerkId,
        subscriptionId: user.subscriptionId,
        plan: user.plan,
      });
      await client.users.updateUser(user.clerkId, {
        publicMetadata: {
          plan: productName,
        },
      });
      await user.save();
      console.log("[stripe:webhook] user updated and saved after update");
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer;
      console.log("[stripe:webhook] subscription.deleted", {
        subscriptionId: subscription.id,
        customer: customerId,
      });

      const user = await User.findOne({ customerId });
      if (!user) {
        console.log(
          "[stripe:webhook] user not found for customer on delete",
          customerId
        );
        return NextResponse.json({
          status: "error",
          message: "User not found",
        });
      }

      user.subscriptionId = undefined;
      user.plan = "none";
      console.log("[stripe:webhook] clearing user subscription", {
        clerkId: user.clerkId,
        subscriptionId: user.subscriptionId,
        plan: user.plan,
      });
      await client.users.updateUser(user.clerkId, {
        publicMetadata: {
          plan: "none",
        },
      });

      await user.save();
      console.log("[stripe:webhook] user cleared and saved");
    }

    return NextResponse.json({ status: "success", event: event.type });

    //
  } catch (err: any) {
    console.log("Webhook Error", err?.message || err);
    try {
      console.log(
        "[stripe:webhook] raw payload (truncated)",
        payload.slice(0, 500)
      );
    } catch {}
    return NextResponse.json({ status: "error", message: err.message });
  }
}
//
