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
  Grid3X3,
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
  Eye,
  Download,
} from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "Video Templates — 100+ Professional Designs for Every Style",
  description:
    "Choose from our curated collection of video templates. Minimal, neon, kinetic, and more styles for lyric videos, captions, and social media content.",
  path: "/templates",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <SeoHead
        title="Video Templates — 100+ Professional Designs for Every Style"
        description="Choose from our curated collection of video templates. Minimal, neon, kinetic, and more styles for lyric videos, captions, and social media content."
        path="/templates"
        ogImage={absoluteUrl(
          "/api/og?title=Video%20Templates&desc=100%2B%20professional%20designs%20for%20every%20style"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/templates" },
          ]),
          faqPageLd([
            {
              question: "How many templates do you offer?",
              answer:
                "We have 100+ professionally designed templates across multiple categories and styles.",
            },
            {
              question: "Can I customize the templates?",
              answer:
                "Yes—fully customizable colors, fonts, layouts, and branding elements.",
            },
            {
              question: "What video types do you support?",
              answer:
                "Lyric videos, captions, social media content, and promotional videos.",
            },
          ]),
          howToLd({
            name: "How to use video templates",
            steps: [
              "Browse our template library",
              "Preview and select your style",
              "Customize colors and branding",
              "Export your finished video",
            ],
          }),
        ]}
      />

      {/* Unique Hero Section - Split layout with template preview */}
      <div className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-6 py-3 text-sm text-purple-200 mb-8">
                <Grid3X3 className="w-5 h-5" />
                100+ Professional Templates
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Video Templates
                <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  That Convert
                </span>
              </h1>

              <p className="text-xl text-neutral-300 max-w-xl leading-relaxed mb-10">
                Choose from our curated collection of professional video
                templates. Minimal, neon, kinetic, and more styles for every
                content type and brand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/upload"
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-xl shadow-purple-500/25 inline-flex items-center gap-3 group"
                >
                  <Play className="w-5 h-5" />
                  Start Creating
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#template-categories"
                  className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Browse All
                </Link>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    100+
                  </div>
                  <div className="text-sm text-neutral-400">Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fuchsia-400 mb-2">
                    15+
                  </div>
                  <div className="text-sm text-neutral-400">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    4K
                  </div>
                  <div className="text-sm text-neutral-400">Quality</div>
                </div>
              </div>
            </div>

            {/* Right side template preview grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Palette className="w-12 h-12 text-purple-300" />
                </div>
                <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-fuchsia-300" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-purple-300" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Star className="w-12 h-12 text-fuchsia-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Template Categories Section - Masonry grid */}
      <div className="py-24 bg-neutral-900/30" id="template-categories">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Template Categories
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Professional designs organized by style, purpose, and platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Sparkles className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Minimal & Clean
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center mb-6">
                  Elegant, simple designs that let your content shine
                </p>
                <div className="text-center">
                  <span className="inline-block bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">
                    25+ Templates
                  </span>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Zap className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Kinetic & Dynamic
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center mb-6">
                  High-energy animations and moving elements
                </p>
                <div className="text-center">
                  <span className="inline-block bg-fuchsia-500/20 text-fuchsia-200 px-3 py-1 rounded-full text-sm">
                    30+ Templates
                  </span>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Palette className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Neon & Glow
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center mb-6">
                  Vibrant colors with modern, eye-catching effects
                </p>
                <div className="text-center">
                  <span className="inline-block bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">
                    20+ Templates
                  </span>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Layers className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Corporate & Business
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center mb-6">
                  Professional designs for business and marketing
                </p>
                <div className="text-center">
                  <span className="inline-block bg-fuchsia-500/20 text-fuchsia-200 px-3 py-1 rounded-full text-sm">
                    15+ Templates
                  </span>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Eye className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Social Media
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center mb-6">
                  Optimized for Instagram, TikTok, and YouTube
                </p>
                <div className="text-center">
                  <span className="inline-block bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">
                    35+ Templates
                  </span>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all">
                  <Download className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Custom Requests
                </h3>
                <p className="text-neutral-300 leading-relaxed text-center mb-6">
                  Need something specific? We can create it for you
                </p>
                <div className="text-center">
                  <span className="inline-block bg-fuchsia-500/20 text-fuchsia-200 px-3 py-1 rounded-full text-sm">
                    Contact Us
                  </span>
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
            title="Template examples in action"
            subtitle="See how our professional templates transform your content"
            examples={[
              {
                id: "minimal-template",
                title: "Minimal Style Template",
                description: "Clean, elegant design with subtle animations",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "2:30",
                aspectRatio: "16:9",
              },
              {
                id: "neon-template",
                title: "Neon Style Template",
                description: "Vibrant colors with glowing text effects",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "3:15",
                aspectRatio: "9:16",
              },
              {
                id: "kinetic-template",
                title: "Kinetic Style Template",
                description: "Dynamic motion and energetic typography",
                videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
                duration: "4:00",
                aspectRatio: "1:1",
              },
            ]}
          />
        </div>
      </div>

      {/* Unique Benefits Section - Side-by-side layout */}
      <div className="py-24 bg-neutral-900/50 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-8">
                Why Choose Our Templates?
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Professional Quality
                    </h3>
                    <p className="text-neutral-300">
                      Every template is designed by professional motion graphics
                      artists with years of experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-fuchsia-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Fully Customizable
                    </h3>
                    <p className="text-neutral-300">
                      Change colors, fonts, layouts, and add your branding to
                      make each template uniquely yours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Platform Optimized
                    </h3>
                    <p className="text-neutral-300">
                      Templates are optimized for different platforms and aspect
                      ratios
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Grid3X3 className="w-16 h-16 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-4">
                    Ready to Use
                  </div>
                  <div className="text-neutral-400 text-lg">
                    Professional templates for every need
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Unique Process Section - Horizontal timeline */}
      <div className="py-24 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              How to Use Templates
            </h2>
            <p className="text-xl text-neutral-300">
              Simple steps to create professional videos
            </p>
          </div>

          <div className="relative">
            {/* Horizontal timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 transform -translate-y-1/2 hidden md:block" />

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Browse
                </h3>
                <p className="text-neutral-300">
                  Explore our collection of 100+ professional templates
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  AI Template Processing
                </h3>
                <p className="text-neutral-300">
                  AI analyzes your content and applies template styling
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Customize
                </h3>
                <p className="text-neutral-300">
                  Add your content, colors, and branding
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  4
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Export
                </h3>
                <p className="text-neutral-300">
                  Download your finished video in multiple formats
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique FAQ Section - Grid layout */}
      <div className="py-24 bg-neutral-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-300">
              Everything you need to know about our templates
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                How many templates do you offer?
              </h3>
              <p className="text-neutral-300 ml-9">
                We have 100+ professionally designed templates across multiple
                categories including minimal, kinetic, neon, corporate, and
                social media styles.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-fuchsia-400" />
                Can I customize the templates?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes—fully customizable colors, fonts, layouts, and branding
                elements to match your brand identity perfectly.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                What video types do you support?
              </h3>
              <p className="text-neutral-300 ml-9">
                Lyric videos, captions, social media content, promotional
                videos, and business presentations.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-fuchsia-400" />
                Are templates royalty-free?
              </h3>
              <p className="text-neutral-300 ml-9">
                Yes, all templates are royalty-free and can be used for
                commercial projects without attribution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA - Unique card design */}
      <div className="py-24 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 rounded-3xl p-16">
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Transform Your Content?
            </h2>
            <p className="text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto">
              Choose from 100+ professional templates and create stunning videos
              that engage your audience and grow your brand
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/upload"
                className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-2xl shadow-purple-500/25"
              >
                <Play className="w-8 h-8" />
                Start Creating Now
              </Link>
              <Link
                href="#template-categories"
                className="inline-flex items-center gap-4 border-2 border-white/20 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-white/10 transition-all duration-300"
              >
                <Grid3X3 className="w-8 h-8" />
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-12 text-center text-neutral-400">
        <p className="text-lg">
          © {new Date().getFullYear()} Sonexa — Professional templates for every
          creator.
        </p>
      </footer>
    </main>
  );
}
