"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackCompleteRegistration } from "@/components/PixelTracker";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Monitor,
} from "lucide-react";
import Link from "next/link";

export default function WelcomePage(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    // Track registration completion for pixel analytics
    
    // send welcome email
    const sendWelcomeEmail = async () => {
      try {
        const res = await fetch("/api/welcome-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to send welcome email");
        }
        console.log("Welcome email sent successfully");
      } catch (error: unknown) {
        console.error("Error sending welcome email", error);
      }
    }
    sendWelcomeEmail();
    trackCompleteRegistration();
  }, []);

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

        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to Sonexa!
        </h1>

        <p className="text-neutral-300 mb-8 leading-relaxed">
          {`You're all set to create amazing lyric videos! For the best
        experience, we recommend using Sonexa on your computer.`}
        </p>

        {/* Platform Recommendations */}
        <div className="space-y-4 mb-8">
          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">
                  Desktop Experience
                </h3>
                <p className="text-sm text-neutral-400">
                  Full editing features
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-300 text-left">
              Access all features including timeline editing, custom templates,
              and high-quality exports on your computer.
            </p>
          </div>

          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">
                  Mobile Preview
                </h3>
                <p className="text-sm text-neutral-400">
                  View and share projects
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-300 text-left">
              Check your projects, share videos, and manage your account from
              your phone.
            </p>
          </div>
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

          <div className="text-center">
            <p className="text-sm text-neutral-500 mb-3">
              Ready to create your first video?
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Start Creating
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-neutral-500">
          <p>Need help getting started?</p>
          <p className="mt-2">
            <Link href="/help" className="text-white hover:underline">
              Check out our guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
