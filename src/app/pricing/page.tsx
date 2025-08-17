import React from "react";
import Link from "next/link";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Basic",
    price: "$9",
    description: "Great to try out AI‑timed lyrics and export simple videos.",
    features: [
      "Up to 3 renders/month",
      "1080p exports",
      "Core lyric templates",
    ],
    ctaLabel: "Get Basic",
    ctaHref: "/sign-up?plan=basic",
  },
  {
    name: "Standard",
    price: "$19",
    description: "Most popular: more styles, faster renders, custom branding.",
    features: [
      "Up to 15 renders/month",
      "1080p & 4K exports",
      "All lyric templates",
      "Brand colors & fonts",
      "Priority rendering",
    ],
    ctaLabel: "Choose Standard",
    ctaHref: "/sign-up?plan=standard",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$39",
    description: "For creators and teams shipping high‑volume social content.",
    features: [
      "Unlimited renders",
      "4K exports + alpha",
      "Team collaboration",
      "Template overrides",
      "Priority support",
    ],
    ctaLabel: "Go Pro",
    ctaHref: "/sign-up?plan=pro",
  },
];

export default function PricingPage(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
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

        <section className="grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative rounded-2xl border p-6 shadow-lg",
                plan.highlight
                  ? "border-white/15 bg-white/10 ring-1 ring-white/20"
                  : "border-white/10 bg-white/5 ring-1 ring-white/10",
              ].join(" ")}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
                  Most Popular
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="text-right">
                  <span className="text-3xl font-semibold">{plan.price}</span>
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
                <Link
                  href={plan.ctaHref}
                  className={[
                    "inline-flex w-full items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition",
                    plan.highlight
                      ? "bg-white text-neutral-900 hover:bg-white/90"
                      : "border border-white/15 bg-transparent text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        <p>
          © {new Date().getFullYear()} MusicVid — Build lyric videos at the
          speed of sound.
        </p>
      </footer>
    </main>
  );
}
