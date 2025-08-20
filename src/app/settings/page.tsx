"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import PricingPage from "@/app/pricing/page";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  User,
  CreditCard,
  Settings,
  LogOut,
  HelpCircle,
  Shield,
  Palette,
  Bell,
  ChevronRight,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";

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

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return <Sparkles className="w-5 h-5" />;
      case "standard":
        return <Star className="w-5 h-5" />;
      case "pro":
        return <Crown className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return "from-blue-500 to-cyan-500";
      case "standard":
        return "from-fuchsia-500 to-purple-500";
      case "pro":
        return "from-purple-500 to-indigo-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

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
        <header className="border-b border-white/10 bg-white/5 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <h1 className="text-xl font-semibold text-white">Change Plan</h1>
            <button
              onClick={() => setShowPlans(false)}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-all"
            >
              ← Back to Settings
            </button>
          </div>
        </header>
        <PricingPage />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
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

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        {/* Hero Header */}
        <header className="mb-16 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
              <Settings className="w-4 h-4 text-fuchsia-400" />
              Account Settings
            </div>
          </div>

          <h1 className="mx-auto max-w-3xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:text-6xl">
            Settings
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/70 leading-relaxed">
            Manage your account, subscription, and preferences to get the most
            out of Sonexa.
          </p>
        </header>

        {/* Alerts */}
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

        {/* Main Settings Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile & Account */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 ring-1 ring-white/10 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 p-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Profile</h2>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <img
                  src={user?.imageUrl}
                  alt="Avatar"
                  className="h-16 w-16 rounded-2xl border-2 border-white/20 object-cover shadow-lg"
                />
                <div>
                  <p className="text-lg font-semibold text-white">
                    {user?.fullName || user?.username || "User"}
                  </p>
                  <p className="text-white/70">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </div>

              <a
                href="/user"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-white font-medium hover:bg-white/20 transition-all hover:scale-105"
              >
                <Settings className="w-4 h-4" />
                Manage Profile
              </a>
            </div>

            {/* Account Security */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 ring-1 ring-white/10 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>

              <p className="text-white/70 mb-6">
                Manage your account security and privacy settings.
              </p>

              <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-white font-medium hover:bg-white/20 transition-all hover:scale-105">
                <Shield className="w-4 h-4" />
                Security Settings
              </button>
            </div>
          </div>

          {/* Center Column - Subscription & Billing */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 ring-1 ring-white/10 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-3">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Subscription</h2>
              </div>

              {/* Current Plan Display */}
              <div className="mb-6">
                <div
                  className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${getPlanColor(
                    prettyPlan
                  )} px-4 py-2 text-white font-semibold`}
                >
                  {getPlanIcon(prettyPlan)}
                  {prettyPlan} Plan
                </div>
                {plan !== "none" && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/20 px-3 py-1 text-xs font-medium text-emerald-200">
                    Active Subscription
                  </div>
                )}
              </div>

              <p className="text-white/70 mb-6">
                {plan === "none"
                  ? "You&apos;re currently on the Free plan with limited features."
                  : `You&apos;re subscribed to the ${prettyPlan} plan with premium features.`}
              </p>

              <div className="space-y-3">
                {/* Upgrade / Change Plan */}
                {plan !== "Pro" && (
                  <button
                    onClick={() => setShowPlans(true)}
                    className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-3 text-white font-semibold transition-all hover:from-fuchsia-600 hover:to-purple-600 hover:scale-105 shadow-lg shadow-fuchsia-500/25"
                  >
                    {plan === "none" ? "Browse Plans" : "Change / Upgrade Plan"}
                  </button>
                )}

                {/* Cancel Plan */}
                {plan !== "none" && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={cancelLoading}
                    className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-red-200 font-medium transition-all hover:bg-red-500/20 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {cancelLoading ? "Canceling…" : "Cancel Plan"}
                  </button>
                )}
              </div>
            </div>

            {/* Billing History */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 ring-1 ring-white/10 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Billing</h2>
              </div>

              <p className="text-white/70 mb-6">
                View your billing history and manage payment methods.
              </p>

              <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-white font-medium hover:bg-white/20 transition-all hover:scale-105">
                <ChevronRight className="w-4 h-4" />
                View Billing
              </button>
            </div>
          </div>

          {/* Right Column - Preferences & Actions */}
          <div className="space-y-6">
            {/* Preferences */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 ring-1 ring-white/10 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 p-3">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Preferences</h2>
              </div>

              <p className="text-white/70 mb-6">
                Customize your experience and notification preferences.
              </p>

              <div className="space-y-3">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-white font-medium hover:bg-white/20 transition-all hover:scale-105">
                  <Palette className="w-4 h-4" />
                  Appearance
                </button>
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-white font-medium hover:bg-white/10 transition-all hover:scale-105">
                  <Bell className="w-4 h-4" />
                  Notifications
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 ring-1 ring-white/10 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 p-3">
                  <LogOut className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Sign Out</h2>
              </div>

              <p className="text-white/70 mb-6">
                Sign out of your account on this device.
              </p>

              <SignOutButton>
                <button className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-red-200 font-medium transition-all hover:bg-red-500/20 hover:scale-105">
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>

        {/* Help & Support Section */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-8 ring-1 ring-yellow-500/20 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">
                  Need Help?
                </h3>
                <p className="text-yellow-100 mb-4 leading-relaxed">
                  Check our comprehensive help documentation or contact our
                  support team for assistance.
                </p>
                <div className="flex gap-3">
                  <a
                    href="/help"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/20 border border-white/30 px-6 py-3 text-white font-medium hover:bg-white/30 transition-all hover:scale-105"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help Center
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-transparent px-6 py-3 text-white font-medium hover:bg-white/10 transition-all hover:scale-105"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
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
        cancelLabel="Keep subscription"
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelPlan}
        loading={cancelLoading}
      />
    </main>
  );
};

export default SettingsPage;
