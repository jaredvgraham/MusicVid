"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import PricingPage from "@/app/pricing/page"; // point to where you saved the new Pricing component
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const SettingsPage = () => {
  const { user, isLoaded } = useUser();
  const [showPlans, setShowPlans] = useState(false);
  const router = useRouter();
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Keep hooks before any early returns to preserve hook order across renders
  const [plan, setPlan] = useState("none");
  useEffect(() => {
    setPlan((user?.publicMetadata?.plan as string | undefined) ?? "none");
  }, [user]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return null;
  }

  const prettyPlan = plan === "none" ? "Free" : plan;

  const handleCancelPlan = async () => {
    setError(null);
    setSuccess(null);
    setCancelLoading(true);
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to cancel subscription.");
      }
      setSuccess("Your subscription has been canceled.");
      // Optional: refresh user state or send them home
      setPlan("none");
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setCancelLoading(false);
      setShowCancelConfirm(false);
    }
  };

  if (showPlans) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-lg font-semibold">Change Plan</h1>
            <button
              onClick={() => setShowPlans(false)}
              className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              Back to Settings
            </button>
          </div>
        </header>
        <PricingPage />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Ambient background (matches pricing) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-1/3 left-1/4 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8))]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <header className="mb-10 text-center">
          <h1 className="mx-auto max-w-3xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl">
            Settings
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Manage your account, subscription, and billing preferences.
          </p>
        </header>

        {/* Alerts */}
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

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Profile */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 shadow-lg">
            <h2 className="text-lg font-semibold">Profile</h2>
            <div className="mt-4 flex items-center gap-4">
              {/* Avatar */}
              <img
                src={user?.imageUrl}
                alt="Avatar"
                className="h-12 w-12 rounded-full border border-white/20 object-cover"
              />
              <div className="text-sm">
                <p className="text-white/90 font-medium">
                  {user?.fullName || user?.username || "User"}
                </p>
                <p className="text-white/60">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="/user"
                className="inline-flex items-center rounded-md border border-white/15 px-3.5 py-2 text-sm text-white hover:bg-white/10"
              >
                Manage profile
              </a>
            </div>
          </div>

          {/* Subscription */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 shadow-lg">
            {plan !== "none" && (
              <div className="absolute -top-3 right-3 rounded-full border border-emerald-400/30 bg-emerald-400/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-200">
                Active
              </div>
            )}
            <h2 className="text-lg font-semibold">Subscription</h2>
            <p className="mt-2 text-sm text-white/70">
              {plan === "none"
                ? "You’re currently on the Free plan."
                : `You’re subscribed to the ${prettyPlan} plan.`}
            </p>

            <div className="mt-6 space-y-3">
              {/* Upgrade / Change Plan */}
              {plan !== "Pro" && (
                <button
                  onClick={() => setShowPlans(true)}
                  className="w-full rounded-md bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90"
                >
                  {plan === "none" ? "Browse Plans" : "Change / Upgrade Plan"}
                </button>
              )}
              {/* Cancel Plan */}
              {plan !== "none" && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelLoading}
                  className="w-full rounded-md border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {cancelLoading ? "Canceling…" : "Cancel Plan"}
                </button>
              )}
            </div>
          </div>

          {/* Logout */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 shadow-lg">
            <h2 className="text-lg font-semibold">Logout</h2>
            <p className="mt-2 text-sm text-white/70">
              Sign out of your account on this device.
            </p>
            <div className="mt-6">
              <SignOutButton>
                <button className="w-full rounded-md border border-white/15 bg-transparent px-3.5 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        </section>

        {/* Help Callout */}
        <section className="mx-auto mt-8 max-w-5xl">
          <div className="flex items-start gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 ring-1 ring-yellow-500/20">
            <span className="text-xl">🆘</span>
            <p className="text-sm text-yellow-100">
              Need help? Check our{" "}
              <a
                href="/help"
                className="font-semibold underline hover:opacity-90"
              >
                Help page
              </a>
              .
            </p>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={showCancelConfirm}
        title="Cancel subscription?"
        description={
          <>
            You will lose access to paid features immediately. This action
            cannot be undone.
          </>
        }
        confirmLabel="Cancel subscription"
        cancelLabel="Cancel"
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelPlan}
        loading={cancelLoading}
      />
    </main>
  );
};

export default SettingsPage;
