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
  Video,
  Sparkles,
  Palette,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Clock,
  Users,
  Layers,
  Music,
  Target,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "Add Lyrics to Video — Overlay Lyrics on Existing Footage",
  description:
    "Transform your videos by adding synchronized lyrics. Perfect for music videos, covers, and performances with professional timing and styling.",
  path: "/add-lyrics-to-video",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <SeoHead
        title="Add Lyrics to Video — Overlay Lyrics on Existing Footage"
        description="Transform your videos by adding synchronized lyrics. Perfect for music videos, covers, and performances with professional timing and styling."
        path="/add-lyrics-to-video"
        ogImage={absoluteUrl(
          "/api/og?title=Add%20Lyrics%20to%20Video&desc=Overlay%20lyrics%20on%20existing%20footage"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Add Lyrics to Video", path: "/add-lyrics-to-video" },
          ]),
          faqPageLd([
            {
              question: "Can I use my own video footage?",
              answer:
                "Yes—upload any video and we'll overlay perfectly timed lyrics on top.",
            },
            {
              question: "How accurate is the lyric timing?",
              answer:
                "Our AI achieves 95%+ accuracy with automatic beat detection and manual fine-tuning.",
            },
            {
              question: "What video formats do you support?",
              answer:
                "MP4, MOV, AVI up to 4K resolution with multiple aspect ratios.",
            },
          ]),
          howToLd({
            name: "How to add lyrics to video",
            steps: [
              "Upload your video file",
              "Add your lyrics text",
              "AI syncs timing automatically",
              "Customize style and export",
            ],
          }),
        ]}
      />

      {/* Unique Hero Section - Split with video preview */}
      <div className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-6 py-3 text-sm text-purple-200 mb-8">
                <Video className="w-5 h-5" />
                Video Enhancement
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Add Lyrics to
                <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Your Videos
                </span>
              </h1>

              <p className="text-xl text-neutral-300 max-w-xl leading-relaxed mb-10">
                Transform your existing footage by adding perfectly synchronized
                lyrics. Perfect for music videos, covers, performances, and
                educational content.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/upload"
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-xl shadow-purple-500/25 inline-flex items-center gap-3 group"
                >
                  <Play className="w-5 h-5" />
                  Start Adding Lyrics
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/templates/lyrics/overlay"
                  className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  View Styles
                </Link>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="text-neutral-300">AI Timing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-fuchsia-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-fuchsia-300" />
                  </div>
                  <span className="text-neutral-300">Custom Styles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="text-neutral-300">4K Export</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-fuchsia-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-fuchsia-300" />
                  </div>
                  <span className="text-neutral-300">All Formats</span>
                </div>
              </div>
            </div>

            {/* Right side video preview */}
            <div className="relative">
              <div className="aspect-video w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Layers className="w-16 h-16 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-4">
                    Video + Lyrics
                  </div>
                  <div className="text-neutral-400 text-lg">
                    Perfect Synchronization
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Unique Features Section - Cards with hover effects */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Professional Video Enhancement
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Transform your footage with AI-powered lyric overlays
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Music className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  AI Lyric Timing
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Automatic beat detection and lyric synchronization for perfect
                  timing
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Palette className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Custom Styling
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Choose from 20+ lyric styles with full color and font
                  customization
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Video className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Preserve Quality
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Maintain your original video quality while adding professional
                  lyrics
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Target className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Multiple Formats
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Export in 16:9, 9:16, 1:1 for all platforms and devices
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Zap className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Fast Processing
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Process videos in minutes, not hours with our optimized engine
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Star className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Professional Results
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center">
                  Studio-quality output that enhances your original content
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
            title="See lyrics added to videos"
            subtitle="Professional examples of lyric overlays on different video types"
            examples={[
              {
                id: "music-video-lyrics",
                title: "Music Video Lyrics",
                description: "Synchronized lyrics on performance footage",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "4:15",
                aspectRatio: "16:9",
              },
              {
                id: "live-performance-lyrics",
                title: "Live Performance Lyrics",
                description: "Lyrics overlaid on concert recordings",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "3:45",
                aspectRatio: "9:16",
              },
              {
                id: "cover-song-lyrics",
                title: "Cover Song Lyrics",
                description: "Karaoke-style lyrics on cover videos",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "5:20",
                aspectRatio: "1:1",
              },
            ]}
          />
        </div>
      </div>

      {/* Unique Stats Section - Hexagonal layout */}
      <div className="py-24 bg-neutral-900/50 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Trusted by Video Creators
            </h2>
            <p className="text-xl text-neutral-300">
              Join thousands who&apos;ve enhanced their videos
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  25K+
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Videos Enhanced
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  95%
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Accuracy Rate
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  20+
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Lyric Styles
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  4K
                </div>
              </div>
              <div className="text-neutral-300 font-semibold text-lg">
                Export Quality
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Process Section - Vertical steps with icons */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-neutral-300">
              Simple steps to add lyrics to your videos
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Upload Your Video
                </h3>
                <p className="text-neutral-300 text-lg">
                  Drop your video file and our AI analyzes the audio for perfect
                  lyric timing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-fuchsia-500 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Add Your Lyrics
                </h3>
                <p className="text-neutral-300 text-lg">
                  Input your lyrics text and our AI automatically syncs lyrics
                  to the beat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Customize Style
                </h3>
                <p className="text-neutral-300 text-lg">
                  Choose from 20+ lyric styles and customize colors, fonts, and
                  positioning
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-fuchsia-600 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Export & Share
                </h3>
                <p className="text-neutral-300 text-lg">
                  Download your enhanced video in multiple formats ready for any
                  platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique FAQ Section - Side-by-side layout */}
      <div className="py-24 bg-neutral-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-300">
              Everything you need to know about adding lyrics to videos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Video className="w-6 h-6 text-purple-400" />
                Can I use my own video footage?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—upload any video and we&apos;ll overlay perfectly timed
                lyrics on top while preserving your original quality.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Music className="w-6 h-6 text-fuchsia-400" />
                How accurate is the lyric timing?
              </h3>
              <p className="text-neutral-300 ml-9">
                Our AI achieves 95%+ accuracy with automatic beat detection and
                manual fine-tuning options for perfect synchronization.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-400" />
                What styling options do you offer?
              </h3>
              <p className="text-neutral-300 ml-9">
                20+ lyric styles with full customization of colors, fonts,
                animations, and positioning to match your brand.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-fuchsia-400" />
                What video formats do you support?
              </h3>
              <p className="text-neutral-300 ml-9">
                MP4, MOV, AVI up to 4K resolution with multiple aspect ratios
                for all platforms and devices.
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
              Ready to Transform Your Videos?
            </h2>
            <p className="text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto">
              Join thousands of creators who&apos;ve already enhanced their
              content with professional lyric overlays that engage and entertain
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <Video className="w-8 h-8" />
              Start Adding Lyrics Now
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-12 text-center text-neutral-400">
        <p className="text-lg">
          © {new Date().getFullYear()} Sonexa — Transform your videos with
          lyrics.
        </p>
      </footer>
    </main>
  );
}
