"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trackPurchase } from "@/components/FacebookPixel";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// Plan prices mapping
const PLAN_PRICES: Record<string, number> = {
  basic: 9.99,
  standard: 19.99,
  pro: 39.99,
};

// Plan display names
const PLAN_NAMES: Record<string, string> = {
  basic: "Basic",
  standard: "Standard",
  pro: "Pro",
};

// Plan colors matching the lyric-video-maker page
const PLAN_COLORS: Record<string, string> = {
  basic: "from-purple-500 to-fuchsia-500",
  standard: "from-purple-500 to-fuchsia-500",
  pro: "from-purple-500 to-fuchsia-500",
};

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if this is a successful checkout return
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const plan = searchParams.get("plan");

    if (success === "true" && sessionId && plan) {
      // Get the actual plan price
      const price = PLAN_PRICES[plan] || 0;

      // Track the purchase event with actual plan data
      trackPurchase(price, "USD", [plan]);

      console.log(
        "Purchase success tracked for session:",
        sessionId,
        "plan:",
        plan,
        "price:",
        price
      );
    } else {
      // If no valid success parameters, redirect to home
      router.push("/");
    }
  }, [searchParams, router]);

  const plan = searchParams.get("plan");
  const planName = plan ? PLAN_NAMES[plan] : "";
  const planPrice = plan ? PLAN_PRICES[plan] : 0;
  const planColor = plan ? PLAN_COLORS[plan] : "from-purple-500 to-fuchsia-500";

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-purple-300 absolute -top-2 -right-2" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to Sonexa!
        </h1>

        <p className="text-neutral-300 mb-6">
          {` Your ${planName} subscription is now active. You're all set to create
          amazing lyric videos!`}
        </p>

        {/* Plan Details */}
        <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 mb-8 hover:border-purple-500/50 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-2">
            {planName} Plan
          </h2>
          <p className="font-bold text-2xl mb-2 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            ${planPrice}/month
          </p>
          <p className="text-neutral-400 text-sm">
            Subscription active • Next billing in 30 days
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25 flex items-center justify-center group"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/upload"
            className="w-full border-2 border-white/20 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
          >
            Create Your First Video
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-neutral-500">
          <p>{`You'll receive a confirmation email shortly`}.</p>
          <p className="mt-2">
            Need help?{" "}
            <Link href="/contact" className="text-white hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
