"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Docs", href: "/#docs" },
];

export default function NavBar(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/60 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600" />
            <span className="text-sm font-semibold tracking-wide text-white">
              MusicVid
            </span>
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <nav className="hidden gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              key="Upload"
              href="/upload"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Upload
            </Link>
          </SignedIn>
        </nav>

        {/* Right: Auth & CTA (desktop) */}
        <div className="hidden items-center gap-2 lg:flex">
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-md px-3 py-1.5 text-sm text-white/80 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-900 transition hover:bg-white/90"
            >
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
          </SignedIn>
        </div>

        {/* Mobile: Hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:bg-white/10 focus:outline-none lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6"
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
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <SignedIn>
                <Link
                  key="Dashboard"
                  href="/dashboard"
                  className="rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  key="Upload"
                  href="/upload"
                  className="rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Upload
                </Link>
              </SignedIn>
            </nav>
            <div className="mt-3 flex items-center gap-2">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="flex-1 rounded-md border border-white/15 bg-transparent px-3 py-2 text-center text-sm text-white/80 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-medium text-neutral-900 hover:bg-white/90"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="flex w-full justify-end">
                  <UserButton
                    appearance={{ elements: { avatarBox: "h-8 w-8" } }}
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
