"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

type NavItem = { label: string; href: string };
type DropdownItem = { label: string; href: string; description?: string };

const seoPages: DropdownItem[] = [
  {
    label: "Lyric Video Maker",
    href: "/lyric-video-maker",
    description: "Create stunning lyric videos with AI timing",
  },
  {
    label: "Add Lyrics to Video",
    href: "/add-lyrics-to-video",
    description: "Overlay lyrics on existing videos",
  },
  {
    label: "AI Caption Generator",
    href: "/ai-caption-generator",
    description: "Generate captions for social media",
  },
  {
    label: "TikTok Captions",
    href: "/tiktok-captions",
    description: "Viral TikTok caption styles",
  },
  {
    label: "YouTube Captions",
    href: "/youtube-captions",
    description: "Professional YouTube captions",
  },
];

const mainNavItems: NavItem[] = [
  { label: "Templates", href: "/templates" },

  { label: "Pricing", href: "/pricing" },
];

export default function NavBar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [seoDropdownOpen, setSeoDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const { isSignedIn } = useAuth();

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setSeoDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setSeoDropdownOpen(false);
    }, 150); // Small delay to prevent flickering
    setDropdownTimeout(timeout);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/10 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Sonexa-Logo"
              width={40}
              height={40}
              priority
            />
            <span className="text-lg font-semibold tracking-wide text-white">
              Sonexa
            </span>
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <nav className="hidden gap-8 lg:flex">
          {/* SEO Pages Dropdown - Only show when signed out */}
          <SignedOut>
            <div className="relative">
              <button
                onClick={() => setSeoDropdownOpen(!seoDropdownOpen)}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
                className="flex items-center gap-2 text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
              >
                Tools
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    seoDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* Dropdown Menu */}
              {seoDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-80 rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-md p-4 shadow-2xl"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="grid gap-3">
                    {seoPages.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="group rounded-lg p-3 transition-all hover:bg-white/5 hover:border-white/10 border border-transparent"
                        onClick={() => setSeoDropdownOpen(false)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-white group-hover:text-fuchsia-300 transition-colors">
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="mt-1 text-sm text-white/60 group-hover:text-white/80 transition-colors">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Upload
            </Link>
            <Link
              href="/settings"
              className="text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Settings
            </Link>
            <Link
              href="/help"
              className="text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Help
            </Link>
          </SignedIn>

          {/* Main Navigation Items */}
          {mainNavItems.map((item) => {
            if (isSignedIn && item.label === "Templates") {
              return null;
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className="text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            );
          })}

          {/* User-specific items */}

          <SignedOut>
            <Link
              href="/upload"
              className="text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Upload
            </Link>
            <Link
              href="/blog"
              className="text-base text-white/70 transition hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Blog
            </Link>
          </SignedOut>
        </nav>

        {/* Right: Auth & CTA (desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-base text-white/80 transition hover:text-white hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 px-5 py-2 text-base font-medium text-white transition hover:from-fuchsia-600 hover:to-purple-600"
            >
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} />
          </SignedIn>
        </div>

        {/* Mobile: Hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-lg p-2.5 text-white/80 hover:bg-white/10 focus:outline-none lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-white/10 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="grid gap-3">
              {/* SEO Pages Section - Only show when signed out */}
              <SignedOut>
                <div className="mb-6">
                  <div className="px-3 py-3 text-sm font-semibold text-white/50 uppercase tracking-wider">
                    Tools
                  </div>
                  {seoPages.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10"
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-5 w-5 text-white/40" />
                    </Link>
                  ))}
                </div>
              </SignedOut>

              {/* User-specific items */}
              <SignedIn>
                <div className="mt-6 border-t border-white/10 pt-6">
                  <div className="px-3 py-3 text-sm font-semibold text-white/50 uppercase tracking-wider">
                    Account
                  </div>
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/upload"
                    className="rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Upload
                  </Link>
                  <Link
                    href="/settings"
                    className="rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/help"
                    className="rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Help
                  </Link>
                </div>
              </SignedIn>
              {/* Main Navigation */}
              {mainNavItems.map((item) => {
                if (isSignedIn && item.label === "Templates") {
                  return null;
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="flex-1 rounded-lg border border-white/15 bg-transparent px-4 py-3 text-center text-base text-white/80 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="flex-1 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 px-4 py-3 text-center text-base font-medium text-white hover:from-fuchsia-600 hover:to-purple-600"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="flex w-full justify-end">
                  <UserButton
                    appearance={{ elements: { avatarBox: "h-10 w-10" } }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
