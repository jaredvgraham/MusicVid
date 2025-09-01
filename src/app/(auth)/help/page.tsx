import React from "react";
import Link from "next/link";

export default function HelpPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-700/20 via-purple-700/20 to-indigo-700/20 p-6 ring-1 ring-white/5">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Help & Getting Started</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-200 sm:text-lg">
          This guide walks you through creating a project, editing, rendering, and exporting your
          final video. Use the links below to jump straight to each section.
        </p>
      </div>

      <nav className="mt-6 grid grid-cols-1 gap-3 text-base text-neutral-200 sm:grid-cols-2">
        <a className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10" href="#quick-start">Quick start</a>
        <a className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10" href="#features">Key features</a>
        <a className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10" href="#projects">Manage projects</a>
        <a className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10" href="#export">Export & download</a>
        <a className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10" href="#troubleshooting">Troubleshooting</a>
      </nav>

      <section id="quick-start" className="mt-8">
        <h2 className="text-2xl font-semibold text-white">Quick start</h2>
        <ol className="mt-4 list-decimal space-y-4 pl-6 text-base leading-relaxed text-neutral-200">
          <li>
            Go to <Link className="text-white underline" href="/upload">Upload</Link> and choose your flow:
            Video + Song, Video Only, or Song Only. Upload your media and create a project.
          </li>
          <li>
            After upload, open your project in the <span className="text-white">Workspace</span> to edit timing,
            lyrics/captions, and visuals.
          </li>
          <li>
            When you’re happy, render your video. You can always return to the
            <Link className="text-white underline ml-1" href="/dashboard">Dashboard</Link> to monitor status.
          </li>
          <li>
            Once the render is ready, download it or export to supported social platforms (when available).
          </li>
        </ol>
      </section>

      <section id="features" className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Key features</h2>
        <ul className="mt-4 space-y-4 text-base leading-relaxed text-neutral-200">
          <li>
            <span className="font-medium text-white">Lyric video maker:</span> Prebuilt presets and styles for fast lyric videos.
            Explore <Link className="text-white underline" href="/templates">Templates</Link> and
            genre examples under <Link className="text-white underline" href="/templates/lyric-video/rock">Lyric Video templates</Link>.
          </li>
          <li>
            <span className="font-medium text-white">AI caption tools:</span> Generate or add captions quickly.
            Try <Link className="text-white underline" href="/ai-caption-generator">AI Caption Generator</Link>,
            <Link className="text-white underline ml-1" href="/tiktok-captions">TikTok Captions</Link>, and
            <Link className="text-white underline ml-1" href="/youtube-captions">YouTube Captions</Link>.
          </li>
          <li>
            <span className="font-medium text-white">Add lyrics to any video:</span> See
            <Link className="text-white underline ml-1" href="/add-lyrics-to-video">Add lyrics</Link>.
          </li>
          <li>
            <span className="font-medium text-white">Workspace editor:</span> Timeline controls, word/lyric adjustments,
            and visual overlays to polish your video.
          </li>
        </ul>
      </section>

      <section id="projects" className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Manage projects</h2>
        <ul className="mt-4 space-y-4 text-base leading-relaxed text-neutral-200">
          <li>
            Visit the <Link className="text-white underline" href="/dashboard">Dashboard</Link> to search, open, or delete projects.
          </li>
          <li>
            Click <span className="text-white">Open Workspace</span> on a project card to continue editing.
          </li>
          <li>
            The <span className="text-white">Final renders</span> section shows your completed videos for quick access.
          </li>
        </ul>
      </section>

      <section id="export" className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Export & download</h2>
        <ul className="mt-4 space-y-4 text-base leading-relaxed text-neutral-200">
          <li>
            Use <span className="text-white">Download</span> on a final render to save the video file to your device.
          </li>
          <li>
            Use <span className="text-white">Export</span> to begin posting to social platforms (when available). You may be
            asked to connect your account before first use.
          </li>
          <li>
            For plan limits or upgrades, see <Link className="text-white underline" href="/pricing">Pricing</Link>.
          </li>
        </ul>
      </section>

      <section id="troubleshooting" className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Troubleshooting</h2>
        <ul className="mt-4 space-y-4 text-base leading-relaxed text-neutral-200">
          <li>
            <span className="font-medium text-white">Upload stuck or slow?</span> Refresh the Dashboard and try again. Large files
            may take time to process after upload completes.
          </li>
          <li>
            <span className="font-medium text-white">Render failed?</span> Open the project, check media sources and timing, and
            render again. If it persists, create a new project and retry.
          </li>
          <li>
            <span className="font-medium text-white">Download not starting?</span> Use the <span className="text-white">Download</span>
            button on the final render card. If the browser blocks it, allow downloads/pop‑ups for this site and retry.
          </li>
          <li>
            <span className="font-medium text-white">Need help with billing or account?</span> Visit
            <Link className="text-white underline ml-1" href="/settings">Settings</Link> or see
            <Link className="text-white underline ml-1" href="/pricing">Pricing</Link>.
          </li>
        </ul>
      </section>

      <div className="mt-14 rounded-xl border border-white/10 bg-white/5 p-5 text-base text-neutral-200">
        Tip: You can always start a new project from the
        <Link className="text-white underline ml-1" href="/upload">Upload</Link> page.
      </div>
    </div>
  );
}
