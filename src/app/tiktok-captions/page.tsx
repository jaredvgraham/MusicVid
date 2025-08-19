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
  Smartphone,
  Sparkles,
  Palette,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Clock,
  Users,
  TrendingUp,
  Target,
  Heart,
  Share2,
} from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "TikTok Captions — Viral Captions for Maximum Engagement",
  description:
    "Create TikTok captions that go viral. Vertical format, trending styles, and AI-powered timing for maximum engagement and reach.",
  path: "/tiktok-captions",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <SeoHead
        title="TikTok Captions — Viral Captions for Maximum Engagement"
        description="Create TikTok captions that go viral. Vertical format, trending styles, and AI-powered timing for maximum engagement and reach."
        path="/tiktok-captions"
        ogImage={absoluteUrl(
          "/api/og?title=TikTok%20Captions&desc=Viral%20captions%20for%20maximum%20engagement"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "TikTok Captions", path: "/tiktok-captions" },
          ]),
          faqPageLd([
            {
              question: "How do you optimize for TikTok's algorithm?",
              answer:
                "We use trending caption styles, optimal timing, and viral-friendly formats that boost engagement.",
            },
            {
              question: "Can I use trending TikTok fonts and styles?",
              answer:
                "Yes—access to the latest TikTok trends, fonts, and caption styles that creators love.",
            },
            {
              question: "What aspect ratios do you support?",
              answer:
                "9:16 vertical format optimized for TikTok, plus 1:1 square for Instagram cross-posting.",
            },
          ]),
          howToLd({
            name: "How to create viral TikTok captions",
            steps: [
              "Upload your video content",
              "Choose trending caption style",
              "AI optimizes timing and text",
              "Export TikTok-ready format",
            ],
          }),
        ]}
      />

      {/* Unique Hero Section - Vertical mobile mockup */}
      <div className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-6 py-3 text-sm text-purple-200 mb-8">
                <TrendingUp className="w-5 h-5" />
                Trending on TikTok
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                TikTok Captions
                <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  That Go Viral
                </span>
              </h1>

              <p className="text-xl text-neutral-300 max-w-xl leading-relaxed mb-10">
                Create captions that dominate TikTok&apos;s algorithm. Vertical
                format, trending styles, and AI-powered timing for maximum
                engagement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/upload"
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-xl shadow-purple-500/25 inline-flex items-center gap-3 group"
                >
                  <Play className="w-5 h-5" />
                  Create Viral Captions
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/templates/captions/tiktok"
                  className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  View Styles
                </Link>
              </div>

              {/* TikTok stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    9:16
                  </div>
                  <div className="text-sm text-neutral-400">Format</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fuchsia-400 mb-2">
                    50+
                  </div>
                  <div className="text-sm text-neutral-400">
                    Trending Styles
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    Viral
                  </div>
                  <div className="text-sm text-neutral-400">Optimized</div>
                </div>
              </div>
            </div>

            {/* Right side mobile mockup */}
            <div className="relative">
              <div className="w-80 h-96 mx-auto bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl border border-white/10 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-3">
                    TikTok Ready
                  </div>
                  <div className="text-neutral-400 text-lg">
                    9:16 Vertical Format
                  </div>
                </div>
              </div>

              {/* Floating engagement icons */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Share2 className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Features Section - Wave layout */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why TikTok Creators Choose Us
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Professional tools designed specifically for TikTok&apos;s unique
              format and algorithm
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <TrendingUp className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Algorithm Optimized
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Captions designed to work with TikTok&apos;s algorithm for
                  maximum reach and engagement
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Smartphone className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Vertical First
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Perfect 9:16 format optimized for mobile viewing and
                  TikTok&apos;s native experience
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Sparkles className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Trending Styles
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Access to the latest TikTok caption trends, fonts, and styles
                  that creators love
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Zap className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  AI Caption Timing
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Perfect synchronization with your audio for maximum impact and
                  readability
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Palette className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Brand Customization
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Match your brand colors, fonts, and style while maintaining
                  TikTok appeal
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Target className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Cross-Platform
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Export for TikTok, Instagram Reels, and YouTube Shorts from
                  one project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Examples Section - Only shared component */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <VideoExamples
            title="TikTok caption styles in action"
            subtitle="See how our trending styles boost engagement and reach"
            examples={[
              {
                id: "trending-tiktok-captions",
                title: "Trending Style Captions",
                description: "Latest TikTok trends with viral appeal",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "0:45",
                aspectRatio: "9:16",
              },
              {
                id: "branded-tiktok-captions",
                title: "Branded Style Captions",
                description: "Professional branding with TikTok flair",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "1:15",
                aspectRatio: "9:16",
              },
              {
                id: "minimal-tiktok-captions",
                title: "Minimal Style Captions",
                description: "Clean, readable captions for maximum impact",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "0:30",
                aspectRatio: "9:16",
              },
            ]}
          />
        </div>
      </div>

      {/* Unique Stats Section - Wave layout */}
      <div className="py-24 bg-neutral-900/50 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Trusted by TikTok Creators
            </h2>
            <p className="text-xl text-neutral-300">
              Join thousands who&apos;ve increased their engagement
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-3xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  75K+
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                TikToks Created
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-3xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  3x
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Higher Engagement
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-3xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  50+
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Trending Styles
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-3xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  9:16
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                TikTok Format
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Process Section - Staggered cards */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              How to Go Viral
            </h2>
            <p className="text-xl text-neutral-300">
              Four simple steps to TikTok success
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Upload Your Content
                </h3>
                <p className="text-neutral-300 text-lg">
                  Drop your TikTok video and our AI analyzes the audio for
                  perfect caption timing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 ml-16">
              <div className="w-20 h-20 bg-fuchsia-500 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Choose Trending Style
                </h3>
                <p className="text-neutral-300 text-lg">
                  Select from 50+ trending caption styles that TikTok creators
                  love
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  AI Optimizes Everything
                </h3>
                <p className="text-neutral-300 text-lg">
                  Perfect caption timing, readability, and algorithm
                  optimization for maximum reach
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 ml-16">
              <div className="w-20 h-20 bg-fuchsia-600 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Export & Post
                </h3>
                <p className="text-neutral-300 text-lg">
                  Download in perfect 9:16 format ready to upload to TikTok
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique FAQ Section - Accordion with icons */}
      <div className="py-24 bg-neutral-900/50">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-300">
              Everything you need to know about TikTok captions
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                How do you optimize for TikTok&apos;s algorithm?
              </h3>
              <p className="text-neutral-300 ml-9">
                We use trending caption styles, optimal timing, and
                viral-friendly formats that boost engagement and work with
                TikTok&apos;s recommendation system.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Palette className="w-6 h-6 text-fuchsia-400" />
                Can I use trending TikTok fonts and styles?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—access to the latest TikTok trends, fonts, and caption
                styles that creators love and that perform well on the platform.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-purple-400" />
                What aspect ratios do you support?
              </h3>
              <p className="text-neutral-300 ml-9">
                9:16 vertical format optimized for TikTok, plus 1:1 square for
                Instagram cross-posting and other platforms.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Zap className="w-6 h-6 text-fuchsia-400" />
                How fast is the processing?
              </h3>
              <p className="text-neutral-300 ml-9">
                Most TikTok videos are processed in under 2 minutes, with longer
                content taking up to 5 minutes for optimal quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA - Unique wave design */}
      <div className="py-24 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <div className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border border-purple-500/20 rounded-3xl p-16">
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Dominate TikTok?
            </h2>
            <p className="text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto">
              Join thousands of creators who&apos;ve already increased their
              engagement with TikTok captions that work with the algorithm
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <Smartphone className="w-8 h-8" />
              Create Viral Captions Now
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-12 text-center text-neutral-400">
        <p className="text-lg">
          © {new Date().getFullYear()} Sonexa — TikTok captions that go viral.
        </p>
      </footer>
    </main>
  );
}
