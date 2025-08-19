"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import SeoHead from "@/components/SeoHead";
import JsonLd from "@/components/JsonLd";
import { faqPageLd, howToLd, absoluteUrl } from "@/lib/seo";

type Plan = {
  name: "Basic" | "Standard" | "Pro";
  price: number;
  description: string;
  features: string[];
  planKey: "basic" | "standard" | "pro";
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Basic",
    price: 9.99,
    description: "Great to try out AI-timed lyrics and export simple videos.",
    features: [
      "Up to 3 renders/month",
      "1080p exports",
      "Core lyric templates",
    ],
    planKey: "basic",
  },
  {
    name: "Standard",
    price: 19.99,
    description: "Most popular: more styles, faster renders, custom branding.",
    features: [
      "Up to 15 renders/month",
      "720p/1080p/1440p exports",
      "All lyric templates",
      "Brand colors & fonts",
      "Priority rendering",
    ],
    planKey: "standard",
    highlight: true,
  },
  {
    name: "Pro",
    price: 39.99,
    description: "For creators and teams shipping high-volume social content.",
    features: [
      "More monthly renders",
      "720p/1080p/1440p exports",
      "Template overrides",
      "Priority support",
    ],
    planKey: "pro",
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
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-1/3 left-1/4 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8))]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-10 pb-16 text-center sm:pt-14">
          <h1 className="mx-auto max-w-3xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Pick the plan that fits your release schedule. Upgrade or cancel
            anytime.
          </p>
        </section>
        <div className="-mt-8 mb-12 text-center">
          <a
            href="/upload"
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
          >
            Start now — upload
          </a>
        </div>

        {/* Error / Success banners */}
        {error && (
          <div className="mx-auto mb-6 max-w-3xl rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-auto mb-6 max-w-3xl rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        )}

        <section className="grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
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
                className={[
                  "relative rounded-2xl border p-6 shadow-lg",
                  plan.highlight
                    ? "border-white/15 bg-white/10 ring-1 ring-white/20"
                    : "border-white/10 bg-white/5 ring-1 ring-white/10",
                ].join(" ")}
              >
                {/* Popular badge */}
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
                    Most Popular
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrent && (
                  <div className="absolute -top-3 right-3 rounded-full border border-emerald-400/30 bg-emerald-400/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-200">
                    Current Plan
                  </div>
                )}

                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="text-right">
                    <span className="text-3xl font-semibold">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-sm text-white/60">/mo</span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-white/70">{plan.description}</p>

                <ul className="mt-5 space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-white/80"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-emerald-400"
                        aria-hidden
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <button
                    onClick={() => handleSubscribe(plan.planKey)}
                    disabled={isLoading}
                    className={[
                      "inline-flex w-full items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition",
                      plan.highlight
                        ? "bg-white text-neutral-900 hover:bg-white/90"
                        : "border border-white/15 bg-transparent text-white hover:bg-white/10",
                      isLoading ? "opacity-70 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {buttonLabel}
                  </button>

                  {/* Nudge under Basic like in old app */}
                  {plan.planKey === "basic" && (
                    <p className="mt-3 text-center text-xs text-white/60">
                      Need more? Upgrade to Standard or Pro anytime.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        <p>
          © {new Date().getFullYear()} Sonexa — Build lyric videos at the speed
          of sound.
        </p>
      </footer>
    </main>
  );
}
