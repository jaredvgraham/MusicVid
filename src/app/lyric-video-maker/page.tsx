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
  Music,
  Sparkles,
  Palette,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Clock,
  Users,
} from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "Lyric Video Maker — Create Stunning Music Videos in Minutes",
  description:
    "Transform your songs into captivating lyric videos with AI-powered timing, beautiful templates, and professional effects.",
  path: "/lyric-video-maker",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <SeoHead
        title="Lyric Video Maker — Create Stunning Music Videos in Minutes"
        description="Transform your songs into captivating lyric videos with AI-powered timing, beautiful templates, and professional effects."
        path="/lyric-video-maker"
        ogImage={absoluteUrl(
          "/api/og?title=Lyric%20Video%20Maker&desc=Create%20stunning%20music%20videos%20in%20minutes"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Lyric Video Maker", path: "/lyric-video-maker" },
          ]),
          faqPageLd([
            {
              question: "How accurate is the AI lyric timing?",
              answer:
                "Our AI achieves 95%+ accuracy with automatic beat detection and manual fine-tuning options.",
            },
            {
              question: "Can I use my own fonts and colors?",
              answer:
                "Yes—fully customizable with your brand colors, custom fonts, and logo integration.",
            },
            {
              question: "What video formats do you support?",
              answer:
                "Export in MP4, MOV, AVI up to 4K resolution with multiple aspect ratios.",
            },
          ]),
          howToLd({
            name: "How to create a lyric video",
            steps: [
              "Upload your audio track",
              "AI generates perfect timing",
              "Choose from 100+ templates",
              "Customize and export",
            ],
          }),
        ]}
      />

      {/* Unique Hero Section - Centered with floating elements */}
      <div className="relative pt-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 text-center">
          {/* Floating background elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-6 py-3 text-sm text-purple-200 mb-8">
            <Sparkles className="w-5 h-5" />
            AI-Powered Creation
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Create Stunning
            <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Lyric Videos
            </span>
          </h1>

          <p className="text-2xl text-neutral-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Transform your songs into captivating visual experiences with
            AI-powered lyric timing, beautiful templates, and professional
            effects. From concept to completion in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/upload"
              className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25 inline-flex items-center gap-3 group"
            >
              <Play className="w-6 h-6" />
              Start Creating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/templates"
              className="border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
            >
              Browse Templates
            </Link>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto max-w-4xl">
            <div className="aspect-video w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Music className="w-16 h-16 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  Your Music, Visualized
                </div>
                <div className="text-neutral-400 text-xl">
                  AI Timing • Professional Templates • Brand Customization
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Features Section - Hexagonal grid */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Creators Choose Our Platform
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Professional tools that make lyric video creation accessible to
              everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-10 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Zap className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  AI Lyric Timing
                </h3>
                <p className="text-neutral-300 leading-relaxed text-lg">
                  Perfect synchronization with your music using advanced beat
                  detection and natural language processing
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-10 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Palette className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  100+ Templates
                </h3>
                <p className="text-neutral-300 leading-relaxed text-lg">
                  Professional designs for every genre and style, fully
                  customizable with your brand elements
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-10 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Star className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Studio Quality
                </h3>
                <p className="text-neutral-300 leading-relaxed text-lg">
                  Export in up to 4K resolution with professional effects,
                  transitions, and animations
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
            title="See lyric videos in action"
            subtitle="Professional examples across different music genres and styles"
            examples={[
              {
                id: "pop-lyric-video",
                title: "Pop Style Lyric Video",
                description:
                  "Bright, energetic visuals with dynamic typography",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "3:45",
                aspectRatio: "16:9",
              },
              {
                id: "rock-lyric-video",
                title: "Rock Style Lyric Video",
                description:
                  "Bold, dramatic effects with powerful visual impact",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "4:20",
                aspectRatio: "16:9",
              },
              {
                id: "edm-lyric-video",
                title: "EDM Style Lyric Video",
                description:
                  "Futuristic aesthetics with synchronized animations",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "5:15",
                aspectRatio: "16:9",
              },
            ]}
          />
        </div>
      </div>

      {/* Unique Stats Section - Circular layout */}
      <div className="py-24 bg-neutral-900/50 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Trusted by Music Creators Worldwide
            </h2>
            <p className="text-xl text-neutral-300">
              Join thousands of artists who&apos;ve transformed their music
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  50K+
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Videos Created
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  95%
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Accuracy Rate
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  100+
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Templates
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/30">
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

      {/* Unique Process Section - Vertical cards */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-neutral-300">
              Four simple steps to your perfect lyric video
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Upload Audio
              </h3>
              <p className="text-neutral-300">
                Drop your music file and our AI analyzes the structure
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-fuchsia-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                AI Lyric Timing
              </h3>
              <p className="text-neutral-300">
                Automatic beat detection and word synchronization
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Choose Template
              </h3>
              <p className="text-neutral-300">
                Select from 100+ professional designs
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-fuchsia-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Export & Share
              </h3>
              <p className="text-neutral-300">
                Download in 4K or share directly to social media
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Unique FAQ Section - Accordion style */}
      <div className="py-24 bg-neutral-900/50">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-300">
              Everything you need to know about creating lyric videos
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                How accurate is the AI timing?
              </h3>
              <p className="text-neutral-300 ml-9">
                Our AI achieves 95%+ accuracy with automatic beat detection and
                manual fine-tuning options for perfect synchronization.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-fuchsia-400" />
                Can I use my own fonts and colors?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—fully customizable with your brand colors, custom fonts, and
                logo integration for consistent branding.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                What video formats do you support?
              </h3>
              <p className="text-neutral-300 ml-9">
                Export in MP4, MOV, AVI up to 4K resolution with multiple aspect
                ratios for all platforms.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-fuchsia-400" />
                How long does processing take?
              </h3>
              <p className="text-neutral-300 ml-9">
                Most videos are processed in under 5 minutes, with larger files
                taking up to 15 minutes for 4K quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA - Unique gradient design */}
      <div className="py-24 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <div className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border border-purple-500/20 rounded-3xl p-16">
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Bring Your Music to Life?
            </h2>
            <p className="text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto">
              Join thousands of artists who&apos;ve already transformed their
              songs into stunning visual experiences that captivate audiences
              worldwide
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <Music className="w-8 h-8" />
              Start Creating Your Lyric Video
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-12 text-center text-neutral-400">
        <p className="text-lg">
          © {new Date().getFullYear()} Sonexa — Transform your music into visual
          art.
        </p>
      </footer>
    </main>
  );
}
