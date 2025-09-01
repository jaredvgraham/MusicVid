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
  MessageSquare,
  Sparkles,
  Palette,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Clock,
  Users,
  Brain,
  Target,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "AI Caption Generator — Auto-Generate Engaging Captions in Seconds",
  description:
    "Transform your videos with AI-powered captions. Automatic timing, multiple styles, and platform optimization for TikTok, Instagram, and YouTube.",
  path: "/ai-caption-generator",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <SeoHead
        title="AI Caption Generator — Auto-Generate Engaging Captions in Seconds"
        description="Transform your videos with AI-powered captions. Automatic timing, multiple styles, and platform optimization for TikTok, Instagram, and YouTube."
        path="/ai-caption-generator"
        ogImage={absoluteUrl(
          "/api/og?title=AI%20Caption%20Generator&desc=Auto-generate%20engaging%20captions%20in%20seconds"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "AI Caption Generator", path: "/ai-caption-generator" },
          ]),
          faqPageLd([
            {
              question: "How accurate is the AI transcription?",
              answer:
                "Our AI achieves 95%+ accuracy with automatic speech recognition and manual editing options.",
            },
            {
              question: "Can I customize caption styles?",
              answer:
                "Yes—fully customizable fonts, colors, animations, and positioning for your brand.",
            },
            {
              question: "What platforms do you support?",
              answer:
                "TikTok, Instagram, YouTube, Facebook, and LinkedIn with platform-specific optimizations.",
            },
          ]),
          howToLd({
            name: "How to generate AI captions",
            steps: [
              "Upload your video file",
              "AI transcribes and times automatically",
              "Choose from caption styles",
              "Export and share",
            ],
          }),
        ]}
      />

      {/* Unique Hero Section - Stacked cards layout */}
      <div className="relative pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-6 py-3 text-sm text-purple-200 mb-8">
              <Brain className="w-5 h-5" />
              AI-Powered Technology
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              AI Caption Generator
              <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                That Engages
              </span>
            </h1>

            <p className="text-2xl text-neutral-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Transform your videos with AI-powered captions that automatically
              sync to your audio. Multiple styles, platform optimization, and
              professional results in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/upload"
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25 inline-flex items-center gap-3 group"
              >
                <Play className="w-6 h-6" />
                Generate Captions Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/templates/captions/modern"
                className="border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
              >
                View Styles
              </Link>
            </div>
          </div>

          {/* Stacked preview cards */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <MessageSquare className="w-16 h-16 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  Auto-Generated Captions
                </div>
                <div className="text-neutral-400 text-xl">
                  AI Timing • Multiple Styles • Platform Ready
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 aspect-video w-full max-w-sm rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-white/10 p-8 flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-purple-300" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  TikTok Ready
                </div>
                <div className="text-neutral-400 text-sm">9:16 Format</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 aspect-video w-full max-w-sm rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-white/10 p-8 flex items-center justify-center transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-fuchsia-300" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  YouTube Ready
                </div>
                <div className="text-neutral-400 text-sm">16:9 Format</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Features Section - Zigzag layout */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose AI Captions?
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Professional results with the power of artificial intelligence
            </p>
          </div>

          <div className="space-y-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-8">
                  <Brain className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  AI-Powered Transcription
                </h3>
                <p className="text-xl text-neutral-300 leading-relaxed">
                  Our advanced AI automatically transcribes your audio with 95%+
                  accuracy, detecting speech patterns and timing for perfect
                  caption synchronization.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      95% Accuracy
                    </div>
                    <div className="text-neutral-400">
                      AI-Powered Recognition
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-8">
                  <Palette className="w-12 h-12 text-fuchsia-300" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Multiple Caption Styles
                </h3>
                <p className="text-xl text-neutral-300 leading-relaxed">
                  Choose from modern, classic, neon, and animated caption
                  styles. Each style is fully customizable with your brand
                  colors and fonts.
                </p>
              </div>
              <div className="lg:order-1 relative">
                <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      15+ Styles
                    </div>
                    <div className="text-neutral-400">Fully Customizable</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  AI Caption Timing
                </h3>
                <p className="text-xl text-neutral-300 leading-relaxed">
                  Perfect synchronization with your audio for maximum impact and
                  readability
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Target className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      All Platforms
                    </div>
                    <div className="text-neutral-400">Optimized Export</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-8">
                  <Target className="w-12 h-12 text-fuchsia-300" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Platform Optimization
                </h3>
                <p className="text-xl text-neutral-300 leading-relaxed">
                  Export captions optimized for TikTok, Instagram, YouTube, and
                  more. Automatic aspect ratio detection and platform-specific
                  formatting.
                </p>
              </div>
              <div className="lg:order-1 relative">
                <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      AI Caption Timing
                    </div>
                    <div className="text-neutral-400">Perfect Sync</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Examples Section - Only shared component */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <VideoExamples
            title="Caption styles in action"
            subtitle="See how different caption styles transform your videos"
            examples={[
              {
                id: "tiktok-captions",
                title: "TikTok Style Captions",
                description: "Bold, readable text optimized for mobile viewing",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "2:45",
                aspectRatio: "9:16",
              },
              {
                id: "youtube-captions",
                title: "YouTube Style Captions",
                description: "Professional captions with clear typography",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "5:20",
                aspectRatio: "16:9",
              },
              {
                id: "instagram-captions",
                title: "Instagram Style Captions",
                description: "Elegant captions with modern aesthetics",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "3:10",
                aspectRatio: "1:1",
              },
            ]}
          />
        </div>
      </div>

      {/* Unique Stats Section - Diamond layout */}
      <div className="py-24 bg-neutral-900/50 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Trusted by Content Creators
            </h2>
            <p className="text-xl text-neutral-300">
              Join thousands who&apos;ve improved their engagement
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  95%
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Accuracy Rate
              </div>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  10x
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Faster Creation
              </div>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  15+
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Caption Styles
              </div>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  24/7
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                AI Processing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Process Section - Circular layout */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-neutral-300">
              Four simple steps to professional captions
            </p>
          </div>

          <div className="relative">
            {/* Circular timeline */}
            <div className="w-96 h-96 mx-auto relative">
              <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-8 border-2 border-fuchsia-500/30 rounded-full"></div>

              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  1
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-white">
                    Upload Video
                  </h3>
                  <p className="text-sm text-neutral-300">
                    Drop your video file
                  </p>
                </div>
              </div>

              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  2
                </div>
                <div className="text-center mt-4 text-right">
                  <h3 className="text-lg font-semibold text-white">
                    AI Caption Processing
                  </h3>
                  <p className="text-sm text-neutral-300">
                    Automatic transcription & timing
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  3
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-white">
                    Choose Style
                  </h3>
                  <p className="text-sm text-neutral-300">
                    Pick caption design
                  </p>
                </div>
              </div>

              <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  4
                </div>
                <div className="text-center mt-4 text-left">
                  <h3 className="text-lg font-semibold text-white">Export</h3>
                  <p className="text-sm text-neutral-300">Download & share</p>
                </div>
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
              Everything you need to know about AI captions
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-400" />
                How accurate is the AI transcription?
              </h3>
              <p className="text-neutral-300 ml-9">
                Our AI achieves 95%+ accuracy with automatic speech recognition
                and manual editing options for perfect results.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Palette className="w-6 h-6 text-fuchsia-400" />
                Can I customize caption styles?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—fully customizable fonts, colors, animations, and
                positioning to match your brand identity perfectly.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-400" />
                What platforms do you support?
              </h3>
              <p className="text-neutral-300 ml-9">
                TikTok, Instagram, YouTube, Facebook, and LinkedIn with
                platform-specific optimizations and aspect ratios.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-fuchsia-400" />
                How long does processing take?
              </h3>
              <p className="text-neutral-300 ml-9">
                Most videos are processed in under 3 minutes, with longer
                content taking up to 10 minutes for optimal accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA - Unique stacked design */}
      <div className="py-24 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 rounded-3xl p-16">
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Boost Your Engagement?
            </h2>
            <p className="text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto">
              Join thousands of creators who&apos;ve already improved their
              video performance with AI-powered captions that keep viewers
              watching
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <MessageSquare className="w-8 h-8" />
              Generate Captions Now
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-12 text-center text-neutral-400">
        <p className="text-lg">
          © {new Date().getFullYear()} Sonexa — AI-powered captions that engage.
        </p>
      </footer>
    </main>
  );
}
