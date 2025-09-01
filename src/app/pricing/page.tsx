"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import SeoHead from "@/components/SeoHead";
import JsonLd from "@/components/JsonLd";
import { faqPageLd, howToLd, absoluteUrl } from "@/lib/seo";
import { Check, Star, Zap, Crown, Sparkles } from "lucide-react";
import {
  trackInitiateCheckout,
  trackViewContent,
} from "@/components/FacebookPixel";

type Plan = {
  name: "Free" | "Basic" | "Standard" | "Pro";
  price: number;
  description: string;
  features: string[];
  planKey: "none" | "basic" | "standard" | "pro";
  highlight?: boolean;
  icon: React.ReactNode;
  color: string;
};

const plans: Plan[] = [
  {
    name: "Basic",
    price: 9.99,
    description:
      "Perfect for creators just getting started with AI-powered lyric videos.",
    features: [
      "Up to 5 renders/month",
      "Up to 5 projects/month",
      "1080p exports",
      "Removed Logo watermark ",
      "Core lyric templates",
      "Basic customization",
      "Email support",
    ],
    planKey: "basic",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Standard",
    price: 19.99,
    description: "Most popular choice for serious creators and content teams.",
    features: [
      "Up to 15 renders/month",
      "Up to 15 projects/month",
      "720p/1080p/1440p exports",
      "Removed Logo watermark ",
      "All lyric templates",
      "Brand colors & fonts",
      "Priority rendering",
      "Advanced customization",
      "Priority support",
    ],
    planKey: "standard",
    highlight: true,
    icon: <Star className="w-6 h-6" />,
    color: "from-fuchsia-500 to-purple-500",
  },
  {
    name: "Pro",
    price: 39.99,
    description:
      "For professional creators and teams shipping high-volume content.",
    features: [
      "Unlimited monthly renders",
      "Unlimited monthly projects",
      "720p/1080p/1440p exports",
      "Removed Logo watermark ",
      "Template overrides",
      "Custom branding",
      "API access",
      "Dedicated support",
      "Team collaboration",
    ],
    planKey: "pro",
    icon: <Crown className="w-6 h-6" />,
    color: "from-purple-500 to-indigo-500",
  },
];

export default function PricingPage(): React.ReactElement {
  const router = useRouter();
  const { user } = useUser();
  const authFetch = useAuthFetch();

  const currentPlan =
    (user?.publicMetadata?.plan as string | undefined)?.toLowerCase?.() ??
    "none";

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Track pricing page view for Facebook Pixel
  useEffect(() => {
    const planIds = plans.map((plan) => plan.planKey);
    trackViewContent(planIds, "product");
  }, []);

  const handleUpgrade = async (planKey: Plan["planKey"]) => {
    setLoading("upgrade");
    setError(null);
    try {
      const res = await authFetch("next", "api/stripe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPlan: planKey }),
      });
      console.log("res", res);
      setSuccess("Upgrade successful. Redirecting to dashboard...");
      router.push("/");
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleSubscribe = async (planKey: Plan["planKey"]) => {
    // Not signed in → go sign in
    if (planKey === "none" && !user) {
      router.push("/sign-in");
      return;
    }
    if (planKey === "none" && user) {
      router.push("/");
      return;
    }
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Already on this plan → manage
    if (currentPlan === planKey) {
      router.push("/settings");
      return;
    }

    // Switching from an active plan → upgrade path
    if (currentPlan !== "none") {
      await handleUpgrade(planKey);
      return;
    }

    // Track InitiateCheckout event for Facebook Pixel
    const selectedPlan = plans.find((plan) => plan.planKey === planKey);
    if (selectedPlan) {
      trackInitiateCheckout(selectedPlan.price, "USD", [planKey]);
    }

    // New checkout
    setLoading(planKey);
    setError(null);
    try {
      const res = await authFetch("next", "api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      console.log("res", res);
      const data = await res;
      console.log("data", data);
      if ((data as any)?.url && typeof (data as any).url === "string") {
        window.location.href = (data as any).url;
      } else {
        throw new Error(
          (data as any)?.message || "Failed to create checkout session."
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <SeoHead
        title="Pricing — Sonexa AI Lyric Video Maker"
        description="Simple, transparent pricing. Auto-timed lyrics and captions with designer presets and fast exports."
        path="/pricing"
        ogImage={absoluteUrl(
          "/api/og?title=Sonexa%20Pricing&desc=AI%20Lyric%20Video%20Maker%20%26%20Caption%20Studio"
        )}
      />
      <JsonLd
        data={[
          faqPageLd([
            {
              question: "Do you support per-word karaoke timing?",
              answer: "Yes—toggle Karaoke mode for per-word highlights.",
            },
            {
              question: "Which exports are available?",
              answer: "MP4 in 16:9, 9:16, 1:1; 720p/1080p/1440p.",
            },
            {
              question: "Can I cancel anytime?",
              answer:
                "Yes—plans are flexible and you can cancel anytime from settings.",
            },
          ]),
          howToLd({
            name: "How to upgrade in Sonexa",
            steps: ["Sign in", "Pick a plan", "Start rendering lyric videos"],
          }),
        ]}
      />

      {/* Enhanced background with floating elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-1/3 left-1/4 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8))]" />

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/10 rounded-full opacity-20 animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 border border-white/10 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Hero Section */}
        <section className="pt-20 pb-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
              <Zap className="w-4 h-4 text-fuchsia-400" />
              Simple, transparent pricing
            </div>
          </div>

          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:text-6xl md:text-7xl">
            Choose Your
            <span className="block bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              Creative Power
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70 leading-relaxed">
            Pick the plan that fits your creative workflow. Upgrade or cancel
            anytime with no hidden fees.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <a
              href="/upload"
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-fuchsia-600 hover:to-purple-600 hover:scale-105 shadow-2xl shadow-fuchsia-500/25"
            >
              <Zap className="w-5 h-5" />
              Start Creating Now
            </a>
          </div>
        </section>

        {/* Error / Success banners */}
        {error && (
          <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-200 backdrop-blur">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-sm text-emerald-200 backdrop-blur">
            {success}
          </div>
        )}

        {/* Free Plan Box */}
        <div className="mx-auto mb-8 max-w-lg text-center">
          <div className="relative rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            {/* Current plan badge for Free */}
            {currentPlan === "none" && (
              <div className="absolute -top-3 left-4 rounded-full border border-emerald-400/30 bg-emerald-400/20 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Current Plan
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">Free Plan</h3>
                <p className="text-xs text-white/70">
                  $0/month • 5 renders • 3 projects • Logo watermark
                </p>
              </div>
              <button
                onClick={() => handleSubscribe("none")}
                className="ml-auto rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-all"
              >
                {currentPlan === "none" ? "Current Plan" : "Start Free"}
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <section className="grid gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.planKey;
            const isLoading = loading === plan.planKey || loading === "upgrade";

            const buttonLabel = isLoading
              ? "Redirecting..."
              : isCurrent
              ? "Manage Subscription"
              : currentPlan !== "none"
              ? `Upgrade to ${plan.name}`
              : `Get ${plan.name}`;

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-8 shadow-2xl transition-all duration-300 hover:scale-105 ${
                  plan.highlight
                    ? "border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent ring-2 ring-fuchsia-500/30"
                    : "border-white/10 bg-gradient-to-br from-white/5 to-transparent ring-1 ring-white/10"
                }`}
              >
                {/* Popular badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500 to-purple-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrent && (
                  <div className="absolute -top-4 left-4 rounded-full border border-emerald-400/30 bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                    Current Plan
                  </div>
                )}

                {/* Plan Icon */}
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${plan.color} text-white shadow-lg`}
                >
                  {plan.icon}
                </div>

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-lg text-white/60">/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mb-6">
                  <button
                    onClick={() => handleSubscribe(plan.planKey)}
                    disabled={isLoading}
                    className={`w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:from-fuchsia-600 hover:to-purple-600 shadow-2xl shadow-fuchsia-500/25"
                        : "border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                    } ${
                      isLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                  >
                    {buttonLabel}
                  </button>
                </div>

                {/* Additional info for Basic plan */}
                {plan.planKey === "basic" && (
                  <p className="text-center text-sm text-white/60">
                    Need more? Upgrade to Standard or Pro anytime.
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* FAQ Section */}
        <section className="pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-12">
              Frequently Asked Questions
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">
                  Do you support per-word karaoke timing?
                </h3>
                <p className="text-white/70">
                  Yes—toggle Karaoke mode for per-word highlights and perfect
                  synchronization.
                </p>
              </div>

              <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">
                  Which exports are available?
                </h3>
                <p className="text-white/70">
                  MP4 in 16:9, 9:16, 1:1; 720p/1080p/1440p quality options.
                </p>
              </div>

              <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="text-white/70">
                  Yes—plans are flexible and you can cancel anytime from your
                  settings.
                </p>
              </div>

              <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-white/70">
                  We accept all major credit cards, debit cards, and PayPal
                  through Stripe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Content?
            </h3>
            <p className="text-white/70 mb-6">
              Join thousands of creators who are already making stunning lyric
              videos and captions.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-white font-medium hover:bg-white/20 transition-all"
            >
              Start Creating Now
            </a>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/50">
                © {new Date().getFullYear()} Sonexa — Build lyric videos at the
                speed of sound.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="/privacy-policy"
                  className="text-white/50 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="text-white/50 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
