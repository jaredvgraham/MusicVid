import type { Metadata } from "next";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import JsonLd from "@/components/JsonLd";
import {
  siteMeta,
  faqPageLd,
  howToLd,
  breadcrumbLd,
  absoluteUrl,
} from "@/lib/seo";
import VideoExamples from "@/components/seo/VideoExamples";
import {
  Play,
  Clock,
  Palette,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Youtube,
} from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "YouTube Captions — Professional, On-Beat, Branded",
  description:
    "Auto captions optimized for YouTube. Horizontal layouts, professional styles, and brand customization.",
  path: "/youtube-captions",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-100">
      {/* Unique diagonal background pattern */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-transparent transform rotate-45" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-fuchsia-500/5 to-transparent transform -rotate-45" />
      </div> */}

      <SeoHead
        title="YouTube Captions — Professional, On-Beat, Branded"
        description="Auto captions optimized for YouTube. Horizontal layouts, professional styles, and brand customization."
        path="/youtube-captions"
        ogImage={absoluteUrl(
          "/api/og?title=YouTube%20Captions&desc=Professional%2C%20on-beat%2C%20branded"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "YouTube Captions", path: "/youtube-captions" },
          ]),
          faqPageLd([
            {
              question: "Do you support per-word karaoke timing?",
              answer: "Yes—toggle Karaoke mode for enhanced engagement.",
            },
            {
              question: "Can I use horizontal and square formats?",
              answer: "Yes—export in 16:9, 1:1, or 9:16 with presets.",
            },
            {
              question: "Are styles customizable for branding?",
              answer:
                "Yes—pick a template and customize colors, fonts, and logos.",
            },
          ]),
          howToLd({
            name: "How to add captions for YouTube",
            steps: [
              "Upload a horizontal clip",
              "Auto caption with timing",
              "Style with professional presets",
              "Export and upload to YouTube",
            ],
          }),
        ]}
      />

      {/* Unique Hero Section - Side-by-side layout */}
      <div className="relative pt-20 ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2 text-sm text-purple-200 mb-6">
                <Youtube className="w-4 h-4" />
                YouTube Optimized
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Professional YouTube Captions
              </h1>
              <p className="text-xl text-neutral-300 max-w-xl leading-relaxed mb-8">
                Transform your YouTube content with AI-powered captions that
                boost engagement, accessibility, and watch time. Professional
                quality in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/upload"
                  className="bg-white text-neutral-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/90 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  Start Creating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/templates/captions/modern"
                  className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  View Templates
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      16:9 Format
                    </div>
                    <div className="text-neutral-400">
                      Professional • Branded • Accessible
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Feature Grid - Hexagonal layout */}
      <div className="py-20 bg-neutral-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why YouTube Creators Choose Us
            </h2>
            <p className="text-xl text-neutral-300">
              Professional tools for professional results
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Clock className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Precise Timing
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Word-perfect synchronization with your audio for professional
                  results that keep viewers engaged
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Palette className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Brand Customization
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Match your brand colors, fonts, and style guidelines perfectly
                  for consistent content
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Zap className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Lightning Fast
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Generate professional captions in seconds, not hours, so you
                  can focus on creating great content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Examples Section - Only shared component */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <VideoExamples
            title="See YouTube captions in action"
            subtitle="Professional caption styles for different YouTube content types"
            examples={[
              {
                id: "tutorial-captions",
                title: "Tutorial Style Captions",
                description:
                  "Educational content with clear, readable typography",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "8:45",
                aspectRatio: "16:9",
              },
              {
                id: "vlog-captions",
                title: "Vlog Style Captions",
                description:
                  "Personal content with friendly, approachable fonts",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "12:30",
                aspectRatio: "16:9",
              },
              {
                id: "business-captions",
                title: "Business Style Captions",
                description:
                  "Corporate content with professional, branded appearance",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "5:18",
                aspectRatio: "16:9",
              },
            ]}
          />
        </div>
      </div>

      {/* Unique Stats Section - Horizontal layout */}
      <div className="py-20 bg-neutral-900/30 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Thousands of Creators
            </h2>
            <p className="text-xl text-neutral-300">
              Join the community of successful YouTubers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-3">
                98%
              </div>
              <div className="text-neutral-300 font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-3">
                3x
              </div>
              <div className="text-neutral-300 font-medium">
                Faster Creation
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-3">
                50+
              </div>
              <div className="text-neutral-300 font-medium">
                Professional Styles
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-3">
                24/7
              </div>
              <div className="text-neutral-300 font-medium">AI Processing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Process Section - Timeline layout */}
      <div className="py-20 bg-neutral-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-neutral-300">
              Three simple steps to professional captions
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-fuchsia-500 transform -translate-x-1/2 hidden md:block" />

              <div className="space-y-16">
                <div className="relative flex items-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white z-10 mx-auto md:mx-0 md:ml-0">
                    1
                  </div>
                  <div className="md:ml-8 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Upload & Process
                    </h3>
                    <p className="text-neutral-300 max-w-md">
                      Drop your YouTube video and our AI analyzes the audio for
                      perfect timing and transcription accuracy
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center text-2xl font-bold text-white z-10 mx-auto md:mx-0 md:ml-0">
                    2
                  </div>
                  <div className="md:ml-8 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Customize & Style
                    </h3>
                    <p className="text-neutral-300 max-w-md">
                      Choose from professional templates and customize colors,
                      fonts, and branding to match your channel
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white z-10 mx-auto md:mx-0 md:ml-0">
                    3
                  </div>
                  <div className="md:ml-8 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Export & Upload
                    </h3>
                    <p className="text-neutral-300 max-w-md">
                      Download your captioned video in 16:9 format ready for
                      YouTube with perfect timing and professional appearance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side visual element */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="aspect-square w-full max-w-md mx-auto rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Youtube className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-3">
                      Ready to Go!
                    </div>
                    <div className="text-neutral-400 text-lg">
                      Professional captions in minutes
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique FAQ Section - Card layout */}
      <div className="py-20 bg-neutral-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-300">
              Everything you need to know about YouTube captions
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                Do you support precise per‑word timing?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—words appear exactly on beat with manual adjustments when
                needed for perfect synchronization.
              </p>
            </div>
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-fuchsia-400" />
                Can I use horizontal and square formats?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—export in 16:9, 1:1, or 9:16 with presets optimized for each
                format.
              </p>
            </div>
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                Are styles customizable for branding?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—pick a template and customize colors, fonts, and logos to
                match your brand perfectly.
              </p>
            </div>
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-fuchsia-400" />
                What video formats do you support?
              </h3>
              <p className="text-neutral-300 ml-9">
                We support MP4, MOV, AVI, and most common video formats up to 4K
                resolution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA - Unique design */}
      <div className="py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your YouTube Content?
            </h2>
            <p className="text-xl text-neutral-300 mb-8">
              Join thousands of creators who&apos;ve already improved their
              engagement with professional captions
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-3 bg-white text-neutral-900 px-10 py-5 rounded-xl font-semibold text-xl hover:bg-white/90 transition-all duration-300 shadow-xl"
            >
              <Play className="w-6 h-6" />
              Start Creating Now
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-10 text-center text-neutral-400">
        <p>
          © {new Date().getFullYear()} Sonexa — Professional YouTube captions at
          the speed of light.
        </p>
      </footer>
    </main>
  );
}
